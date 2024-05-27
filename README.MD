<h2>Завдання Блоку 4: NodeJS</h2>

Сутність 3 - період часу <i>Period</i> <i>src/model/period.ts</i> із атрибутами дати початку <i>start</i> і завершення періоду <i>finish</i>.
Сутність 1 - людина <i>Person</i>.<p>

<h3>Ендпойнт створення сутності періоду </h3>
POST /api/period
<p>
Приклад запиту
<pre>
POST localhost:8888/api/period
{
    "personId":6062,
    "periodType":"Entrepreneurship",
    "start":"2020-01-02",
    "finish":"2023-01-02",
    "remark":"Self-employed"
}
</pre>
<p>
Адреса сервісу для перевірки існування сутності людини зберігається в <i>Consul</i> із ключем <i>endpoint.person</i>, у разі відсутності значення запит надсилається за адресою <u>http://localhost:8080/api/person/</u>
<p>
<h3>Ендпойнт запиту переліку сутностей періоду для зазначеної людини упорядкованих за зменшенням дати початку періода</h3><p>
GET /api/period/personId?from=start&size=amount
<p>
Приклад запиту 
<pre>
GET localhost:8888/api/period/6062?from=3&size=2
</pre>
<p>
<h3>Ендпойнт запиту кількості сутностей періодів окремо для кожної людини </h3>
POST /api/period/_counts
<p>
Приклад запиту
<pre>
POST localhost:8888/api/period/_counts
{
    "personIds":[2,3,4,6,10,6062]
}
</pre>
<p>
Приклад відповіді<p>
<pre>
{
    "2": 1,
    "3": 2,
    "4": 1,
    "6": 1,
    "10": 14,
    "6062": 6
}
</pre>