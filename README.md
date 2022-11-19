# jwt

Kako radi jwt ?

Prilikom uspesne autentifikacije usera na server ili bilo koji backend servis,
sledi proces autorizacije.(Naravno ako zelimo da imamo permisije i pravo pristupa
odredjenim resursima.)

Server ce da napravi json objekat koji zovemo json web token i da ga vrati klijentu.
Client ce u Header Http Requesta da umetne ovaj token i tako posalje request serveru.
Server ce na onsovu toga znati da li klijent moze da pristupi nekom resursu.

Sustina je da je ovaj vid autorizacije stateless(Server ne mora da pamti stanje i da cuva
bilo sta vezano od podataka za korisnike).Jedino sto server zapravo cuva je kljuc
(secret key) kojim ce da enkriptuje(potpise-sign) podatke koji mu stignu od klijenta.
Kako ovo obicno funkcionise?


I) Proces kreiranja jwt:

Pretpostavimo da je klijent uputio post request kojim ce se ulogovati na neki server
sa svojim kredencijalima. Nakon uspesne autentifikacije obicno se uzme id ili korisniko ime
usera i stavi se u objekat 'payload'(PAYLOAD: DATA) koji moze sadrzati jos neke propertije(kad je izdat token,
do kada vazi), jednostavnosti radi imamo objekat payload:{'name': username}.
Pored ovog objekta postoji i header:{'alg': 'HS256', 'type':'jwt'} koji oznacava
koji ce se algoritam koristiti za enkripciju podataka.
Dva poznatija: HS256(Simetricna enkripcija), RS256(Asimetricna enkripcija).
Treci deo jwt je sam potpis(enkripcija) koja se radi pomocu tajnog kljuca(secret key)

Ukratko, imamo:
    HEADER:ALGORITHM & TOKEN TYPE
        {
            "alg": "RS256",
            "typ": "JWT"
        }
    PAYLOAD:DATA                            SECRET_KEY = sklj
        {
            "name": "'username'"
        }

Prvo, enkodiracemo(promenicemo reprezentaciju podataka) ova dva objekta kako bismo dobili
dva niza bajtova, odvojena tackom. Hashovacemo ih i enkriptovati nasim tajnim kljucem sto ce
zapravo oznacavati nas potpis prethodno hash-ovanih podataka.
Recimo,primer kako moze izgledati jwt. 

"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 - enkodirani header
.eyJuYW1lIjoiU3JlY2tvIiwiaWF0IjoxNjY4ODA1MTUwfQ - enkodirani payload
.u4WHRwmpfUl7YtPq9H6n4f_lk9dP--h4GGnQZLs3Uas" - enkriptovani hash enkodiranog headera i payloada

Nakon uspesno kreiranog jwt, on se salje nazad clientu gde se obicno cuva u nekom cookie storage-u.


II) Proces validacije jwt-a.

Kako klijent zna da je primio validan jwt?
Klijentska strana ce deenkriptovati poptisane podatke sa javnim kljucem (public key)
naseg servera i dobiti odgovarajuci hash. (U ovom slucaju je to javni kljuc jer se koristiti RS256).
Zatim, klijent ce da enkodira header i payload i da ih hashuje.
Ukoliko su hashovi isti, radi se o istim enkodiranim podacima, sto znaci da smo zaista dobili
validan token od servera i mozemo da ga sacuvamo.

III) Proces verifikacije jwt-a.

Ostalo je samo jos da se odgovri na pitanje kako sad server zna koji klijent moze 
da pristupi kom resursu. Kada stigne request sa klijentske strane zajedno sa jwt u Http Headeru,
serverska strane verifikuje jwt na jednostavan nacin. Enkodirani, pa zatim hashovani 
header i payload jwt-a ce opet biti enkriptovani tajnim kljucem i dobicemo potpis. Ukoliko je taj potpis
isti onom koji se nalazi u jwt-u verifikacija je uspesno prosla i moze se nastaviti sa daljim izvrsavanjem
logike na serverskoj strani. 


