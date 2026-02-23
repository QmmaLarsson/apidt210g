# Laboration 3 i kursen DT210G, Fördjupad frontendutveckling

Detta är en webbtjänst i form av ett API som är skapat för en blogg. Det hanterar säkerhet och autentisering genom registreing av användare, inloggning och användning av JWT för sessionshantering. APIet används också för att hantera och lagra bloggens inlägg, det använder sig av CRUD-operationer, det vill säga CREATE, READ, UPDATE och DELETE. Projektet är skapad med hjälp av NodeJs, Express, Mongoose och NoSQL-databasen MongoDB Atlas.

### Installation av databas

APIet är kopplat till en MongoDB Atlas-databas. För att komma igång, börja med att klona ned källkodsfilerna. Kör sedan kommandot "npm install" för att installera de nödvändiga npm-paketen. Slutligen, kör skriptet "index.js".

### Länk till API



### Användning av API

Nedan finns en beskriving av hur man på olika sätt kan nå APIet:

| Metod | Ändpunkt | Beskrivning |
|---|---|---|
| POST | /register | Lägger till en ny användare. Exempel på JSON-data: { "username": "user", "password": "password" }. |
| POST | /login | Loggar in en användare. Exempel på JSON-data: { "username": "user", "password": "password" }. |
| GET | /blog | Hämtar inlägg från bloggen. Exempel på JSON-data: { "title": "Måndag", "text": "Idag har jag tagit en promenad" }. |
| POST | /blog | Lägger till ett nytt inlägg. Detta är en skyddad route och kräver ett JWT-token för att kunna nås.
| DELETE | /blog/id | Tar bort ett inlägg. Detta är en skyddad route och kräver ett JWT-token för att kunna nås. |
| PUT | /blog/id | Uppdaterar ett inlägg. Detta är en skyddad route och kräver ett JWT-token för att kunna nås. |