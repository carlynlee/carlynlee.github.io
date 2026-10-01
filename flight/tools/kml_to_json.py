#!/usr/bin/env python3
"""Convert Flightradar24 KML exports into the compact flights.json used by flight/index.html.

Usage: python3 kml_to_json.py path/to/*.kml > ../flights.json

The original 2017 KML files live in git history (commit c2fde87, flight/kml/).
Each output point is [seconds since takeoff, lon, lat, altitude m, ground speed kt, heading deg].
"""
import json
import math
import re
import sys
from datetime import datetime

AIRPORTS = {  # ICAO/FAA id: (name, lat, lon)
    "EMT": ("San Gabriel Valley (El Monte)", 34.0861, -118.0350),
    "CMA": ("Camarillo", 34.2137, -119.0943),
    "SBA": ("Santa Barbara", 34.4262, -119.8404),
    "OXR": ("Oxnard", 34.2008, -119.2072),
    "SZP": ("Santa Paula", 34.3472, -119.0611),
    "POC": ("Brackett Field (La Verne)", 34.0916, -117.7818),
    "CCB": ("Cable (Upland)", 34.1116, -117.6875),
    "CNO": ("Chino", 33.9747, -117.6366),
    "WHP": ("Whiteman", 34.2593, -118.4135),
    "VNY": ("Van Nuys", 34.2098, -118.4895),
    "BUR": ("Hollywood Burbank", 34.2007, -118.3587),
    "SMO": ("Santa Monica", 34.0158, -118.4513),
    "HHR": ("Hawthorne", 33.9228, -118.3350),
    "TOA": ("Torrance", 33.8034, -118.3396),
    "CPM": ("Compton", 33.8900, -118.2436),
    "LGB": ("Long Beach", 33.8177, -118.1516),
    "FUL": ("Fullerton", 33.8720, -117.9800),
    "SNA": ("John Wayne", 33.6757, -117.8682),
    "AVX": ("Catalina", 33.4050, -118.4158),
    "RAL": ("Riverside", 33.9519, -117.4451),
    "L35": ("Big Bear", 34.2637, -116.8560),
    "PMD": ("Palmdale", 34.6294, -118.0846),
    "WJF": ("Fox Field (Lancaster)", 34.7411, -118.2186),
}


def km(lat1, lon1, lat2, lon2):
    p = math.pi / 180
    a = (math.sin((lat2 - lat1) * p / 2) ** 2
         + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin((lon2 - lon1) * p / 2) ** 2)
    return 12742 * math.asin(math.sqrt(a))


def nearest_airport(lat, lon, max_km=6):
    code, (name, alat, alon) = min(AIRPORTS.items(), key=lambda kv: km(lat, lon, kv[1][1], kv[1][2]))
    return code if km(lat, lon, alat, alon) <= max_km else None


def parse(path):
    s = open(path, encoding="utf-8").read()
    pts = []
    for pm in re.findall(r"<Placemark>(.*?)</Placemark>", s, re.S):
        when = re.search(r"<when>([^<]+)</when>", pm)
        coord = re.search(r"<Point>.*?<coordinates>([^<]+)</coordinates>", pm, re.S)
        if not (when and coord):
            continue  # route segments; the points carry everything we need
        lon, lat, alt = (float(v) for v in coord.group(1).strip().split(","))
        speed = re.search(r"Speed:\D*(\d+)", pm)
        heading = re.search(r"<heading>(\d+)</heading>", pm)
        t = datetime.fromisoformat(when.group(1)).timestamp()
        pts.append((t, lon, lat, alt, int(speed.group(1)) if speed else 0, int(heading.group(1)) if heading else 0))
    pts.sort()
    t0 = pts[0][0]
    start, end = pts[0], pts[-1]
    return {
        "id": re.search(r"([0-9a-f]{7})\.kml$", path).group(1),
        "start": datetime.utcfromtimestamp(t0).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "duration": round(end[0] - t0),
        "from": nearest_airport(start[2], start[1]),
        "to": nearest_airport(end[2], end[1]),
        "maxAltFt": round(max(p[3] for p in pts) / 0.3048, -1),
        "points": [[round(t - t0), round(lon, 5), round(lat, 5), round(alt), kt, hdg]
                   for t, lon, lat, alt, kt, hdg in pts],
    }


if __name__ == "__main__":
    flights = sorted((parse(p) for p in sys.argv[1:]), key=lambda f: f["start"])
    used = {c for f in flights for c in (f["from"], f["to"]) if c}
    airports = {c: {"name": AIRPORTS[c][0], "lat": AIRPORTS[c][1], "lon": AIRPORTS[c][2]} for c in sorted(used)}
    json.dump({"aircraft": "N89084", "airports": airports, "flights": flights}, sys.stdout, separators=(",", ":"))
