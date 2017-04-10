# [Start Bootstrap](http://startbootstrap.com/) - [SB Admin](http://startbootstrap.com/template-overviews/sb-admin/)

[SB Admin](http://startbootstrap.com/template-overviews/sb-admin/) is an open source, admin dashboard template for [Bootstrap](http://getbootstrap.com/) created by [Start Bootstrap](http://startbootstrap.com/).

## Getting Started

To use this template, choose one of the following options to get started:
* Download the latest release on Start Bootstrap
* Fork this repository on GitHub

## Bugs and Issues

Have a bug or an issue with this template? [Open a new issue](https://github.com/IronSummitMedia/startbootstrap-sb-admin/issues) here on GitHub or leave a comment on the [template overview page at Start Bootstrap](http://startbootstrap.com/template-overviews/sb-admin/).

## Creator

Start Bootstrap was created by and is maintained by **David Miller**, Managing Parter at [Iron Summit Media Strategies](http://www.ironsummitmedia.com/).

* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

## Copyright and License

Copyright 2013-2015 Iron Summit Media Strategies, LLC. Code released under the [Apache 2.0](https://github.com/IronSummitMedia/startbootstrap-sb-admin/blob/gh-pages/LICENSE) license.

## TODO:
### in Dashboard

* Area Chart - show progress on last ride

* Task Panel -  show last activity  with links to ride details. use  https://www.strava.com/activities/:id  (for example: https://www.strava.com/activities/932006201)

* Replace Transactions panel with rankings on starred segments:


list all starred segments
``` 
 curl -G https://www.strava.com/api/v3/segments/starred \
    -H "Authorization: Bearer a1a5ce7129a73ebfd5d7ccf84db5a723444cc728"
```


for each starred segment show distance, grade, ranking for segment :id
``` 
    curl -G https://www.strava.com/api/v3/segment_efforts/:id \
    -H "Authorization: Bearer a1a5ce7129a73ebfd5d7ccf84db5a723444cc728"

example
```
        curl -G https://www.strava.com/api/v3/segment_efforts/22813051946 \
    -H "Authorization: Bearer a1a5ce7129a73ebfd5d7ccf84db5a723444cc728"
```


