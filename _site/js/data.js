function Currency(a,b){this.amounts={},this.amounts[b]=a}function Options(a,b,c,d,e,f,g){this.n=a,this.avgvalue=b,this.antifraud=c,this.visasecure=d,this.recurring=e,this.multiacquirer=f,this.mobilepay=g}function acq_cost_default(a){return{setup:this.fee_setup,monthly:this.fee_monthly,trans:a.avgvalue.scale(this.fee_variable/100).add(this.fee_fixed).scale(a.n)}}var tmp,currency_value={DKK:1,SEK:.821,NOK:.912,EUR:7.444,USD:5.904},currency_map={DKK:"kr",SEK:"kr",NOK:"kr",EUR:"&#128;",USD:"&#36;"},currency_rmap={kr:"DKK","€":"EUR",$:"USD",sek:"SEK",nok:"NOK"};Currency.prototype.type="currency",Currency.prototype.print=function(){var a=Math.round(100*this.dkk())/100,b=a.toString().split(".");return b[0]=b[0].replace(/\B(?=(\d{3})+(?!\d))/g,"."),2==b.length&&1==b[1].length&&(b[1]+="0"),b.join(",")+" kr"},Currency.prototype.represent=function(){if(1==this.amounts.length)for(var a in this.amounts)return currency_map.hasOwnProperty(a)?this.amounts[a]+" "+currency_map[a]:this.amounts[a]+" "+a;return this.dkk()+" kr"},Currency.prototype.dkk=function(){var a=0;for(var b in this.amounts)this.amounts.hasOwnProperty(b)&&currency_value.hasOwnProperty(b)&&(a+=currency_value[b]*this.amounts[b]);return a},Currency.prototype.add=function(a){var b,c=new Currency(0,"DKK");for(b in this.amounts)this.amounts.hasOwnProperty(b)&&(c.amounts[b]=this.amounts[b]);for(b in a.amounts)a.amounts.hasOwnProperty(b)&&(c.amounts.hasOwnProperty(b)||(c.amounts[b]=0),c.amounts[b]+=a.amounts[b]);return c},Currency.prototype.is_equal_to=function(a){for(var b in this.amounts)if(this.amounts.hasOwnProperty(b)&&this.amounts[b]!==a.amounts[b])return!1;return!0},Currency.prototype.scale=function(a){var b=new Currency(0,"DKK");for(var c in this.amounts)this.amounts.hasOwnProperty(c)&&(b.amounts[c]=this.amounts[c]*a);return b};var cards={dankort:{name:"Dankort",logo:"dankort.png"},visa:{name:"Visa",logo:"visa.png"},mastercard:{name:"MasterCard",logo:"master.png"},maestro:{name:"Maestro",logo:"maestro.png"},diners:{name:"Diners",logo:"diners.png"},amex:{name:"American Express",logo:"amex.png"},jcb:{name:"JCB",logo:"jcb.png"},unionpay:{name:"UnionPay",logo:"unionpay.png"},forbrugsforeningen:{name:"Forbrugsforeningen",logo:"forbrugsforeningen.png"}},acqs={teller:{name:"Teller",logo:"teller.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(1e3,"DKK"),fee_monthly:new Currency(149,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.5,costfn:function(a){var b=this.fee_fixed.add(a.avgvalue.scale(this.fee_variable/100));return b.dkk()<.7&&(b=new Currency(.7,"DKK")),{setup:this.fee_setup,monthly:this.fee_monthly,trans:b.scale(a.n)}}},handelsbanken:{name:"Handelsbanken",logo:"handelsbanken.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(0,"DKK"),fee_monthly:new Currency(0,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.5,costfn:acq_cost_default},nets:{name:"nets",logo:"nets.png",cards:["dankort"],fee_setup:new Currency(250,"DKK"),fee_monthly:new Currency(1e3/12,"DKK"),costfn:function(a){var b=1.39;return a.avgvalue.dkk()<=100&&(b=1.1),a.avgvalue.dkk()<=50&&(b=.7),{setup:this.fee_setup,monthly:this.fee_monthly,trans:new Currency(b,"DKK").scale(a.n)}}},nordea:{name:"Nordea",logo:"nordea.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(0,"DKK"),fee_monthly:new Currency(0,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.6,costfn:acq_cost_default},swedbank:{name:"Swedbank",logo:"swedbank.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(1900,"DKK"),fee_monthly:new Currency(100,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.6,costfn:acq_cost_default},valitor:{name:"Valitor",logo:"valitor.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(0,"DKK"),fee_monthly:new Currency(0,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.5,costfn:acq_cost_default},elavon:{name:"Elavon",logo:"elavon.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(0,"DKK"),fee_monthly:new Currency(0,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.6,costfn:acq_cost_default},clearhaus:{name:"Clearhaus",logo:"clearhaus.png",cards:["visa","mastercard","maestro"],fee_setup:new Currency(0,"DKK"),fee_monthly:new Currency(0,"DKK"),fee_fixed:new Currency(0,"DKK"),fee_variable:1.5,costfn:acq_cost_default}},psps={braintree:{name:"braintree",logo:"braintree.png",link:"https://www.braintreepayments.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){return a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"DKK"),monthly:new Currency(0,"DKK"),trans:a.avgvalue.scale(2.9/100).add(new Currency(2.25,"DKK")).scale(a.n)}}},certitrade:{name:"Certitrade",logo:"certitrade.png",link:"http://www.certitrade.net/kortbetalning.php",is_acquirer:!1,acquirers:["handelsbanken","nordea","euroline","swedbank"],cards:["visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"SEK"),monthly:new Currency(192,"SEK"),trans:a.avgvalue.scale(.9/100).add(new Currency(1.5,"SEK")).scale(a.n)}}},dandomain:{name:"DanDomain",logo:"dandomain.png",link:"http://dandomain.dk/produkter/betalingssystem.html",is_acquirer:!1,acquirers:["nets","teller"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){if(a.multiacquirer||a.mobilepay)return null;var b=199,c=149;return a.visasecure&&(b+=99,c+=49),a.recurring&&(b+=299,c+=a.n<100?99:a.n<1e3?149:399),{setup:new Currency(b,"DKK"),monthly:new Currency(c,"DKK"),trans:new Currency(0,"DKK")}}},dibsstartup:{name:"DIBS Startup",logo:"dibs.png",link:"http://dibs.dk",is_acquirer:!1,acquirers:["nets","euroline","teller","swedbank","valitor","handelsbanken","elavon"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.recurring||a.visasecure||a.multiacquirer||a.mobilepay?null:{setup:new Currency(1495,"DKK"),monthly:new Currency(195,"DKK"),trans:new Currency(1.5,"DKK").scale(a.n)}}},dibspro:{name:"DIBS Professional",logo:"dibs.png",link:"http://dibs.dk",is_acquirer:!1,acquirers:["nets","euroline","teller","swedbank","valitor","handelsbanken","elavon"],cards:["dankort","visa","mastercard","maestro","diners","amex"],costfn:function(a){return a.antifraud||a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(2e3,"DKK"),monthly:new Currency(395,"DKK"),trans:new Currency(1.5,"DKK").scale(a.n)}}},dibsint:{name:"DIBS International",logo:"dibs.png",link:"http://dibs.dk",is_acquirer:!1,acquirers:["nets","euroline","teller","swedbank","valitor","handelsbanken","elavon"],cards:["dankort","visa","mastercard","maestro","diners","amex"],costfn:function(a){return{setup:new Currency(5e3,"DKK"),monthly:new Currency(795,"DKK"),trans:new Currency(1,"DKK").scale(a.n)}}},epaylight:{name:"ePay Light",logo:"epay.png",link:"http://epay.dk",is_acquirer:!1,acquirers:["nets"],cards:["dankort"],costfn:function(a){if(a.recurring||a.visasecure||a.multiacquirer)return null;var b=.25,c=0;return a.antifraud&&(c=new Currency(.3,"DKK").scale(a.n)),{setup:new Currency(399,"DKK"),monthly:new Currency(99,"DKK"),trans:new Currency(b,"DKK").scale(Math.max(a.n-250,0)).add(c)}}},epaypro:{name:"ePay Pro",logo:"epay.png",link:"http://epay.dk",is_acquirer:!1,acquirers:["nets","teller"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){if(a.recurring||a.multiacquirer)return null;var b=.25,c=0;return a.antifraud&&(c=new Currency(.3,"DKK").scale(a.n)),{setup:new Currency(599,"DKK"),monthly:new Currency(199,"DKK"),trans:new Currency(b,"DKK").scale(Math.max(a.n-250,0)).add(c)}}},epaybusiness:{name:"ePay Business",logo:"epay.png",link:"http://epay.dk",is_acquirer:!1,acquirers:["nets","euroline","teller","swedbank","handelsbanken","valitor"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){var b=.25,c=0,d=0;return a.antifraud&&(c=new Currency(.3,"DKK").scale(a.n)),a.recurring&&(d=new Currency(1,"DKK").scale(a.n)),{setup:new Currency(999,"DKK").add(d),monthly:new Currency(299,"DKK"),trans:new Currency(b,"DKK").scale(Math.max(a.n-500,0)).add(c)}}},netaxeptstart:{name:"Netaxept Start",logo:"nets.png",link:"https://www.terminalshop.dk/Netaxept/",is_acquirer:!1,acquirers:["nets","teller"],cards:["dankort","visa","mastercard"],costfn:function(a){return a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(1005,"DKK"),monthly:new Currency(180,"DKK"),trans:new Currency(1.5,"DKK").scale(a.n)}}},netaxeptplus:{name:"Netaxept Plus",logo:"nets.png",link:"https://www.terminalshop.dk/Netaxept/",is_acquirer:!1,acquirers:["nets","teller","elavon","euroline","swedbank","nordea"],cards:["dankort","visa","mastercard"],costfn:function(a){return a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(3016,"DKK"),monthly:new Currency(502,"DKK"),trans:new Currency(1,"DKK").scale(a.n)}}},netaxeptadvanced:{name:"Netaxept Advanced",logo:"nets.png",link:"https://www.terminalshop.dk/Netaxept/",is_acquirer:!1,acquirers:["nets","teller","elavon","euroline","swedbank","nordea"],cards:["dankort","visa","mastercard"],costfn:function(a){if(a.multiacquirer)return null;var b=0;return(a.recurring||a.multiacquirer)&&(b=new Currency(250,"DKK")),{setup:new Currency(7540,"DKK"),monthly:new Currency(703,"DKK").add(b),trans:new Currency(.7,"DKK").scale(a.n)}}},payer:{name:"Payer.se",logo:"payer.png",link:"http://payer.se/betallosning/",is_acquirer:!1,acquirers:["handelsbanken","euroline","swedbank","nordea"],cards:["visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(1400,"SEK"),monthly:new Currency(400,"SEK"),trans:new Currency(2,"SEK").scale(a.n)}}},paymill:{name:"Paymill",logo:"paymill.png",link:"https://paymill.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"EUR"),monthly:new Currency(0,"EUR"),trans:a.avgvalue.scale(2.95/100).add(new Currency(.28,"EUR")).scale(a.n)}}},paypal:{name:"paypal",logo:"paypal.png",link:"https://paypal.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){if(a.antifraud||a.multiacquirer||a.mobilepay)return null;var b=a.n*a.avgvalue.dkk(),c=1.9;return 8e5>=b&&(c=2.4),4e5>=b&&(c=2.7),8e4>=b&&(c=2.9),2e4>=b&&(c=3.4),{setup:new Currency(0,"DKK"),monthly:new Currency(0,"DKK"),trans:a.avgvalue.scale(c/100).add(new Currency(2.6,"DKK")).scale(a.n)}}},payson:{name:"Payson",logo:"payson.png",link:"https://www.payson.se",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"SEK"),monthly:new Currency(0,"SEK"),trans:a.avgvalue.scale(.03).add(new Currency(3,"SEK")).scale(a.n)}}},payza:{name:"Payza",logo:"payza.png",link:"https://payza.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"DKK"),monthly:new Currency(0,"DKK"),trans:a.avgvalue.scale(.025).add(new Currency(1.9,"DKK")).scale(a.n)}}},pointbas:{name:"Point Bas",logo:"point.png",link:"http://www.point.se/sv/Sweden/Start/E-handel/",is_acquirer:!1,acquirers:["handelsbanken","nordea","euroline","swedbank"],cards:["visa","mastercard","diners","amex"],costfn:function(a){return a.recurring||a.multiacquirer||a.multiacquirer||a.mobilepay?null:{setup:new Currency(999,"SEK"),monthly:new Currency(199,"SEK"),trans:new Currency(4,"SEK").scale(Math.max(a.n-100,0))}}},pointpremium:{name:"Point Premium",logo:"point.png",link:"http://www.point.se/sv/Sweden/Start/E-handel/",is_acquirer:!1,acquirers:["handelsbanken","nordea","euroline","swedbank"],cards:["visa","mastercard","diners","amex"],costfn:function(a){return a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(2499,"SEK"),monthly:new Currency(499,"SEK"),trans:new Currency(2.5,"SEK").scale(Math.max(a.n-400,0))}}},pointpremiumplus:{name:"Point PremiumPlus",logo:"point.png",link:"http://www.point.se/sv/Sweden/Start/E-handel/",is_acquirer:!1,acquirers:["nets","handelsbanken","nordea","euroline","swedbank"],cards:["dankort","visa","mastercard","diners","amex","jcb"],costfn:function(a){return a.recurring||a.multiacquirer||a.mobilepay?null:{setup:new Currency(4999,"SEK"),monthly:new Currency(1999,"SEK"),trans:new Currency(.75,"SEK").scale(Math.max(a.n-4e3,0))}}},stripe:{name:"Stripe",logo:"stripe.png",link:"https://stripe.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){return a.multiacquirer||a.mobilepay?null:{setup:new Currency(0,"USD"),monthly:new Currency(0,"USD"),trans:a.avgvalue.scale(2.9/100).add(new Currency(.3,"USD")).scale(a.n)}}},quickpay:{name:"quickpay",logo:"quickpay.png",link:"http://quickpay.dk",is_acquirer:!1,acquirers:["nets","euroline","teller","swedbank","Elavon","handelsbanken"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){if(a.multiacquirer)return null;for(var b=[0,500,600,1e3,3e3,1e4,3e4],c=[0,.5,.4,.3,.25,.15,.1],d=0,e=0,f=0;f<b.length;f++){var g;g=f<b.length-1?Math.min(b[f+1]-b[f],a.n-e):a.n-e,d+=g*c[f],e+=g}return{setup:new Currency(0,"DKK"),monthly:new Currency(150,"DKK"),trans:new Currency(d,"DKK")}}},scannet:{name:"Scannet",logo:"scannet.png",link:"http://www.scannet.dk/hosting/betalingsloesning/",is_acquirer:!1,acquirers:["nets","teller"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){return a.antifraud||a.recurring||a.visasecure||a.multiacquirer||a.mobilepay?null:{setup:new Currency(950,"DKK"),monthly:new Currency(399,"DKK"),trans:new Currency(0,"DKK")}}},skrill:{name:"Skrill",logo:"skrill.png",link:"https://skrill.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){if(a.antifraud||a.multiacquirer||a.mobilepay)return null;var b=a.n*a.avgvalue.dkk(),c=1.9;return b<=new Currency(5e4,"EUR").dkk()&&(c=2.1),b<=new Currency(25e3,"EUR").dkk()&&(c=2.5),b<=new Currency(2500,"EUR").dkk()&&(c=2.9),{setup:new Currency(0,"EUR"),monthly:new Currency(0,"EUR"),trans:a.avgvalue.scale(c/100).add(new Currency(.25,"EUR")).scale(a.n)}}},wannafind:{name:"Wannafind",logo:"wannafind.png",link:"https://wannafind.dk/betalingsgateway/",is_acquirer:!1,acquirers:["nets","teller"],cards:["dankort","visa","mastercard","maestro"],costfn:function(a){if(a.multiacquirer||a.mobilepay)return null;var b=0,c=0;return a.visasecure&&(c=new Currency(49,"DKK")),a.recurring&&(b=new Currency(99,"DKK")),{setup:new Currency(0,"DKK"),monthly:new Currency(149,"DKK").add(b).add(c),trans:new Currency(0,"DKK")}}},yourpay:{name:"yourpay",logo:"yourpay.png",link:"http://yourpay.dk",is_acquirer:!0,acquirers:[],cards:["dankort","visa","mastercard","maestro","diners","amex"],costfn:function(a){if(a.antifraud||a.multiacquirer||a.recurring||a.mobilepay)return null;var b=2.25;return{setup:new Currency(0,"DKK"),monthly:new Currency(0,"DKK"),trans:a.avgvalue.scale(b/100).scale(Math.max(a.n,0))}}},klarnacheckout:{name:"klarna checkout",logo:"klarna.png",link:"https://klarna.se",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro"],costfn:function(a){if(a.multiacquirer||a.mobilepay)return null;var b=2.95;return{setup:new Currency(3995,"SEK"),monthly:new Currency(599,"SEK"),trans:a.avgvalue.scale(b/100).scale(a.n)}}},"2checkout":{name:"2checkout",logo:"2checkout.png",link:"https://www.2checkout.com",is_acquirer:!0,acquirers:[],cards:["visa","mastercard","maestro","amex","jcb","diners"],costfn:function(a){if(a.multiacquirer||a.mobilepay)return null;var b=5.5;return{setup:new Currency(0,"USD"),monthly:new Currency(0,"USD"),trans:a.avgvalue.scale(b/100).add(new Currency(.45,"USD")).scale(a.n)}}}};