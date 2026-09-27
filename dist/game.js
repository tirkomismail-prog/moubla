(()=>{var l0=Object.defineProperty;var c0=(s,t)=>{for(var e in t)l0(s,e,{get:t[e],enumerable:!0})};function cn(s){let t=s>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Hr=class{constructor(t=Math.random()*2**32>>>0){this.seed=t>>>0,this.next=cn(this.seed)}reseed(t){this.seed=t>>>0,this.next=cn(this.seed)}float(){return this.next()}range(t,e){return t+(e-t)*this.next()}int(t,e){return t+Math.floor(this.next()*(e-t+1))}chance(t){return this.next()<t}pick(t){return t[Math.floor(this.next()*t.length)]}weighted(t){let e=0;for(let i of t)e+=i[1];let n=this.next()*e;for(let i of t)if(n-=i[1],n<=0)return i[0];return t[t.length-1][0]}shuffle(t){for(let e=t.length-1;e>0;e--){let n=Math.floor(this.next()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}gauss(){let t=Math.max(1e-9,this.next()),e=this.next();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e)}},lt=new Hr;var oe=(s,t,e)=>s<t?t:s>e?e:s;var _e=(s,t,e,n)=>{let i=s-e,r=t-n;return i*i+r*r},Ye=(s,t,e,n)=>Math.sqrt(_e(s,t,e,n));function ze(s){for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;return s}function Gu(s,t,e){let n=ze(t-s);return Math.abs(n)<=e?t:s+Math.sign(n)*e}function Gn(s,t,e){let n=oe((e-s)/(t-s),0,1);return n*n*(3-2*n)}var Vu=1;function Wu(s){Vu=Math.max(Vu,s)}function _a(s){let t=Math.floor(s/24)+1,e=Math.floor(s%24),n=Math.floor(s%1*60);return{day:t,text:`${String(e).padStart(2,"0")}:${String(n).padStart(2,"0")}`}}function Fi(s,t,e,n){let i=s%10,r=s%100;return i===1&&r!==11?t:i>=2&&i<=4&&(r<10||r>=20)?e:n}function $u(s){let t=parseInt(s.slice(1),16);return[t>>16&255,t>>8&255,t&255]}function Xu(s,t){let[e,n,i]=$u(s),r=o=>oe(Math.round(o*t),0,255);return`rgb(${r(e)},${r(n)},${r(i)})`}var Ht={velmar:{id:"velmar",name:"\u041A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u043E \u0412\u0435\u043B\u044C\u043C\u0430\u0440",short:"\u0412\u0435\u043B\u044C\u043C\u0430\u0440",adj:"\u0432\u0435\u043B\u044C\u043C\u0430\u0440\u0441\u044C\u043A\u0438\u0439",color:"#c0392b",color2:"#f4d03f",king:"\u041A\u043E\u0440\u043E\u043B\u044C \u0413\u0430\u0440\u0430\u043B\u044C\u0434",anchor:[.24,.46],lords:["\u0413\u0440\u0430\u0444 \u041E\u0434\u0440\u0456\u043D","\u0411\u0430\u0440\u043E\u043D \u0415\u043B\u044C\u0440\u0456\u043A","\u0421\u0435\u0440 \u0413\u043E\u0434\u0444\u0440\u0456","\u0413\u0440\u0430\u0444 \u041C\u0430\u043B\u044C\u0432\u0435\u043D","\u0411\u0430\u0440\u043E\u043D \u0422\u0435\u0432\u0430\u043B\u044C\u0434"],towns:["\u0412\u0435\u043B\u044C\u043C\u043E\u0440","\u0410\u0440\u0434\u0435\u0439\u043D","\u041B\u043E\u0440\u0432\u0456\u043A"],castles:["\u0417\u0430\u043C\u043E\u043A \u0413\u0440\u0435\u0439\u0432\u0443\u0434","\u0417\u0430\u043C\u043E\u043A \u0415\u043B\u044C\u043D\u0430\u0440"],villages:["\u041C\u0456\u0434\u0431\u0440\u0443\u043A","\u0422\u0430\u0440\u043D\u0444\u043E\u0440\u0434","\u0415\u0448\u043B\u0456","\u0420\u043E\u0443\u0437\u0432\u0435\u043B","\u041A\u0456\u043D\u0433\u0441\u0445\u043E\u043B\u043C","\u0411\u0440\u0430\u0439\u0442\u043E\u043D"],desc:"\u041B\u0438\u0446\u0430\u0440\u0441\u044C\u043A\u0435 \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u043E \u0437\u0430\u0445\u0456\u0434\u043D\u0438\u0445 \u0440\u0456\u0432\u043D\u0438\u043D. \u0421\u043B\u0430\u0432\u0438\u0442\u044C\u0441\u044F \u0432\u0430\u0436\u043A\u043E\u044E \u043A\u0456\u043D\u043D\u043E\u0442\u043E\u044E \u0442\u0430 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A\u0430\u043C\u0438."},nordheim:{id:"nordheim",name:"\u042F\u0440\u043B\u0441\u0442\u0432\u043E \u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C",short:"\u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C",adj:"\u043D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0441\u044C\u043A\u0438\u0439",color:"#2e6fbf",color2:"#dfe6ee",king:"\u041A\u043E\u043D\u0443\u043D\u0433 \u0420\u0430\u0433\u043D\u0432\u0430\u043B\u044C\u0434",anchor:[.52,.17],lords:["\u042F\u0440\u043B \u0413\u0443\u043D\u043D\u0430\u0440","\u042F\u0440\u043B \u0421\u0456\u0433\u0443\u0440\u0434","\u042F\u0440\u043B \u0422\u043E\u0440\u0432\u0430\u043B\u044C\u0434","\u042F\u0440\u043B \u0411\u0439\u043E\u0440\u043D","\u042F\u0440\u043B \u0415\u0439\u043D\u0430\u0440"],towns:["\u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C","\u0421\u043A\u0430\u0440\u0433\u0430\u0440\u0434","\u0412\u0430\u043B\u044C\u0441\u0443\u043D\u0434"],castles:["\u0424\u0439\u043E\u0440\u0434\u0431\u043E\u0440\u0433","\u0406\u0441\u0431\u0440\u0435\u043A\u043A"],villages:["\u0413\u0430\u043B\u044C\u0432\u0456\u043A","\u0422\u0440\u043E\u043D\u0432\u0456\u043A","\u0421\u043D\u0435\u0444\u0439\u043E\u043B","\u0423\u043B\u044C\u0432\u0434\u0430\u043B\u044C","\u0420\u0435\u043D\u0433\u043E\u043B\u044C\u043C","\u0421\u043A\u0435\u0439\u0434"],desc:"\u0421\u0443\u0432\u043E\u0440\u0456 \u043F\u0456\u0432\u043D\u0456\u0447\u043D\u0456 \u0432\u043E\u0457\u043D\u0438. \u041D\u0430\u0439\u043A\u0440\u0430\u0449\u0430 \u043F\u0456\u0445\u043E\u0442\u0430 \u041A\u0430\u043B\u044C\u0434\u0435\u0440\u0456\u0457, \u043F\u0440\u043E\u0442\u0435 \u043C\u0430\u0439\u0436\u0435 \u0431\u0435\u0437 \u043A\u0456\u043D\u043D\u043E\u0442\u0438."},kaganate:{id:"kaganate",name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u0439 \u041A\u0430\u0433\u0430\u043D\u0430\u0442",short:"\u041A\u0430\u0433\u0430\u043D\u0430\u0442",adj:"\u0441\u0442\u0435\u043F\u043E\u0432\u0438\u0439",color:"#d99a1e",color2:"#6b3a12",king:"\u041A\u0430\u0433\u0430\u043D \u0411\u0430\u0442\u0438\u0440",anchor:[.77,.55],lords:["\u0411\u0435\u043A \u0410\u043B\u0442\u0430\u043D","\u0411\u0435\u043A \u0422\u0430\u0440\u0445\u0430\u043D","\u0411\u0435\u043A \u041A\u0443\u0442\u043B\u0443\u0433","\u0411\u0435\u043A \u0406\u043B\u044C\u0447\u0456","\u0411\u0435\u043A \u0421\u0430\u0440\u0438\u0431\u0430\u0439"],towns:["\u0410\u043A-\u041E\u0440\u0434\u0430","\u041A\u0438\u0437\u0438\u043B-\u0422\u0435\u043F\u0435","\u0422\u0435\u043D\u0433\u0456\u0437-\u041A\u0430\u043B\u0430"],castles:["\u041A\u0430\u0440\u0430-\u041A\u0430\u043B\u0435","\u0411\u043E\u0437\u0442\u0430\u0443"],villages:["\u0410\u043B\u0442\u0438\u043D-\u0421\u0443","\u041A\u043E\u043A\u0442\u0430\u043B","\u0421\u0430\u0440\u0438-\u0411\u0435\u043B","\u041A\u0443\u043C-\u0410\u0442\u0430","\u0416\u0443\u0441\u0430\u043D","\u0422\u0430\u043B-\u0411\u0443\u043B\u0430\u043A"],desc:"\u041A\u043E\u0447\u043E\u0432\u0438\u043A\u0438 \u0441\u0445\u043E\u0434\u0443. \u041A\u0456\u043D\u043D\u0456 \u043B\u0443\u0447\u043D\u0438\u043A\u0438, \u0449\u043E \u0437\u0430\u0441\u0438\u043F\u0430\u044E\u0442\u044C \u0432\u043E\u0440\u043E\u0433\u0430 \u0441\u0442\u0440\u0456\u043B\u0430\u043C\u0438."},rodan:{id:"rodan",name:"\u041A\u043D\u044F\u0437\u0456\u0432\u0441\u0442\u0432\u043E \u0420\u043E\u0434\u0430\u043D\u044C",short:"\u0420\u043E\u0434\u0430\u043D\u044C",adj:"\u0440\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439",color:"#2f8f4e",color2:"#e8e1c4",king:"\u0412\u0435\u043B\u0438\u043A\u0438\u0439 \u043A\u043D\u044F\u0437\u044C \u0421\u0432\u044F\u0442\u043E\u043C\u0438\u0440",anchor:[.36,.8],lords:["\u0412\u043E\u0454\u0432\u043E\u0434\u0430 \u0420\u0430\u0442\u0438\u0431\u043E\u0440","\u0411\u043E\u044F\u0440\u0438\u043D \u0414\u043E\u0431\u0440\u043E\u043C\u0438\u0440","\u041A\u043D\u044F\u0437\u044C \u041C\u0438\u0440\u043E\u0441\u043B\u0430\u0432","\u0412\u043E\u0454\u0432\u043E\u0434\u0430 \u041E\u0441\u0442\u0440\u043E\u043C\u0438\u0440","\u0411\u043E\u044F\u0440\u0438\u043D \u0413\u043E\u0440\u0434\u0456\u0439"],towns:["\u0420\u043E\u0434\u0430\u043D\u044C","\u0417\u043B\u0430\u0442\u043E\u0433\u0440\u0430\u0434","\u0412\u0435\u0440\u0445\u043E\u0437\u0456\u0440"],castles:["\u041A\u0430\u043C\u2019\u044F\u043D\u0438\u0439 \u0411\u0440\u0456\u0434","\u0421\u043E\u043A\u0456\u043B\u044C\u043D\u044F"],villages:["\u0414\u0443\u0431\u043A\u0438","\u041E\u0437\u0435\u0440\u043D\u0435","\u041B\u0438\u043F\u043E\u0432\u0435","\u0412\u0435\u0440\u0431\u0456\u0432\u043A\u0430","\u042F\u0441\u0435\u043D\u0456\u0432","\u041A\u0430\u043B\u0438\u043D\u0456\u0432\u043A\u0430"],desc:"\u0413\u0456\u0440\u0441\u044C\u043A\u0435 \u043A\u043D\u044F\u0437\u0456\u0432\u0441\u0442\u0432\u043E \u043F\u0456\u0432\u0434\u043D\u044F. \u0421\u0442\u0456\u0439\u043A\u0456 \u0441\u043F\u0438\u0441\u043E\u043D\u043E\u0441\u0446\u0456 \u0442\u0430 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A\u0438 \u0437 \u043F\u0430\u0432\u0435\u0437\u0430\u043C\u0438."}},Re=Object.keys(Ht),h0={id:"player",name:"\u0412\u0430\u0448\u0456 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F",short:"\u0412\u0430\u0448\u0456",color:"#8e44ad",color2:"#f5eef8"},qu={id:"bandits",name:"\u0420\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438",short:"\u0420\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438",color:"#555555",color2:"#222222"};function He(s){return s==="player"?h0:s==="bandits"?qu:Ht[s]||qu}var Jt=s=>({eq:{},up:[],ms:3,rs:1,rd:1,...s}),Gt={velmar_recruit:Jt({name:"\u041D\u043E\u0432\u043E\u0431\u0440\u0430\u043D\u0435\u0446\u044C \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:1,type:"inf",hp:45,ms:2,eq:{melee:["pitchfork","club","cleaver"],armor:["tunic"],helmet:[null,"hood"]},up:["velmar_militia","velmar_squire"]}),velmar_militia:Jt({name:"\u041E\u043F\u043E\u043B\u0447\u0435\u043D\u0435\u0446\u044C \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:2,type:"inf",hp:55,ms:4,eq:{melee:["spear","axe_hand","sword_short"],shield:["shield_wood"],armor:["padded"],helmet:["leather_cap","hood"]},up:["velmar_footman","velmar_crossbow"]}),velmar_footman:Jt({name:"\u041F\u0456\u0445\u043E\u0442\u0438\u043D\u0435\u0446\u044C \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:3,type:"inf",hp:65,ms:6,eq:{melee:["sword_arming","spear_war"],shield:["shield_kite"],armor:["gambeson","mail_shirt"],helmet:["nasal","kettle"]},up:["velmar_sergeant"]}),velmar_sergeant:Jt({name:"\u0421\u0435\u0440\u0436\u0430\u043D\u0442 \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:4,type:"inf",hp:75,ms:8,eq:{melee:["sword_arming","mace_iron","axe_war"],shield:["shield_heater"],armor:["hauberk"],helmet:["kettle","great_helm"]}}),velmar_crossbow:Jt({name:"\u0410\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:3,type:"arch",hp:60,ms:4,rs:6,eq:{melee:["sword_short"],ranged:["crossbow_light"],armor:["gambeson"],helmet:["kettle","leather_cap"]},up:["velmar_sharpshooter"]}),velmar_sharpshooter:Jt({name:"\u0412\u043B\u0443\u0447\u043D\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A",faction:"velmar",tier:4,type:"arch",hp:66,ms:5,rs:8,eq:{melee:["sword_arming"],ranged:["crossbow"],shield:[null],armor:["mail_shirt"],helmet:["kettle"]}}),velmar_squire:Jt({name:"\u0417\u0431\u0440\u043E\u0454\u043D\u043E\u0441\u0435\u0446\u044C",faction:"velmar",tier:2,type:"cav",hp:55,ms:4,rd:4,eq:{melee:["sword_short","spear"],shield:["shield_wood"],armor:["padded"],helmet:["leather_cap"],horse:["sumpter"]},up:["velmar_manatarms"]}),velmar_manatarms:Jt({name:"\u041B\u0430\u0442\u043D\u0438\u043A",faction:"velmar",tier:3,type:"cav",hp:65,ms:6,rd:6,eq:{melee:["sword_arming","lance"],shield:["shield_kite"],armor:["mail_shirt"],helmet:["nasal"],horse:["hunter","courser"]},up:["velmar_knight"]}),velmar_knight:Jt({name:"\u041B\u0438\u0446\u0430\u0440 \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443",faction:"velmar",tier:5,type:"cav",hp:85,ms:9,rd:9,eq:{melee:["lance","sword_fine","flail"],shield:["shield_heater"],armor:["brigandine","plate"],helmet:["great_helm"],horse:["destrier","charger"]}}),nord_recruit:Jt({name:"\u041D\u043E\u0432\u043E\u0431\u0440\u0430\u043D\u0435\u0446\u044C \u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0443",faction:"nordheim",tier:1,type:"inf",hp:48,ms:3,eq:{melee:["axe_hand","club","spear"],shield:[null,"shield_wood"],armor:["tunic"],helmet:["fur_hat",null]},up:["nord_footman","nord_hunter"]}),nord_footman:Jt({name:"\u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0441\u044C\u043A\u0438\u0439 \u0432\u043E\u0457\u043D",faction:"nordheim",tier:2,type:"inf",hp:58,ms:5,eq:{melee:["axe_hand","spear"],ranged:[null,"javelins"],shield:["shield_round"],armor:["leather","padded"],helmet:["fur_hat","leather_cap"]},up:["nord_trained"]}),nord_trained:Jt({name:"\u0414\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u0439 \u0432\u043E\u0457\u043D",faction:"nordheim",tier:3,type:"inf",hp:68,ms:6,eq:{melee:["axe_war","sword_short"],ranged:["throwing_axes",null],shield:["shield_round"],armor:["mail_shirt"],helmet:["spangen"]},up:["nord_veteran"]}),nord_veteran:Jt({name:"\u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0441\u044C\u043A\u0438\u0439 \u0432\u0435\u0442\u0435\u0440\u0430\u043D",faction:"nordheim",tier:4,type:"inf",hp:76,ms:8,eq:{melee:["axe_war","greataxe","sword_arming"],ranged:["throwing_axes"],shield:["shield_round"],armor:["hauberk"],helmet:["spangen"]},up:["nord_huscarl"]}),nord_huscarl:Jt({name:"\u0425\u0443\u0441\u043A\u0430\u0440\u043B",faction:"nordheim",tier:5,type:"inf",hp:90,ms:10,eq:{melee:["greataxe","sword_fine","axe_war"],ranged:["throwing_axes"],shield:["shield_round"],armor:["brigandine"],helmet:["spangen"]}}),nord_hunter:Jt({name:"\u041C\u0438\u0441\u043B\u0438\u0432\u0435\u0446\u044C \u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0443",faction:"nordheim",tier:2,type:"arch",hp:52,ms:3,rs:4,eq:{melee:["axe_hand"],ranged:["bow_hunting"],armor:["leather"],helmet:["fur_hat"]},up:["nord_archer"]}),nord_archer:Jt({name:"\u041B\u0443\u0447\u043D\u0438\u043A \u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0443",faction:"nordheim",tier:3,type:"arch",hp:60,ms:4,rs:6,eq:{melee:["axe_hand","sword_short"],ranged:["bow_long"],armor:["leather","gambeson"],helmet:["leather_cap","nasal"]},up:["nord_veteran_archer"]}),nord_veteran_archer:Jt({name:"\u0412\u0435\u0442\u0435\u0440\u0430\u043D-\u043B\u0443\u0447\u043D\u0438\u043A",faction:"nordheim",tier:4,type:"arch",hp:68,ms:5,rs:8,eq:{melee:["sword_arming"],ranged:["bow_long"],armor:["mail_shirt"],helmet:["nasal"]}}),kag_tribesman:Jt({name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u043A",faction:"kaganate",tier:1,type:"harch",hp:44,ms:2,rs:3,rd:4,eq:{melee:["cleaver","club"],ranged:["bow_hunting"],armor:["tunic"],helmet:["fur_hat"],horse:["steppe_horse"]},up:["kag_skirmisher","kag_horseman"]}),kag_skirmisher:Jt({name:"\u041A\u0456\u043D\u043D\u0438\u0439 \u0441\u0442\u0440\u0456\u043B\u0435\u0446\u044C",faction:"kaganate",tier:2,type:"harch",hp:52,ms:3,rs:5,rd:5,eq:{melee:["sabre","axe_hand"],ranged:["bow_short"],shield:[null],armor:["padded","leather"],helmet:["fur_hat","leather_cap"],horse:["steppe_horse"]},up:["kag_horse_archer"]}),kag_horse_archer:Jt({name:"\u041A\u0456\u043D\u043D\u0438\u0439 \u043B\u0443\u0447\u043D\u0438\u043A",faction:"kaganate",tier:3,type:"harch",hp:60,ms:4,rs:7,rd:7,eq:{melee:["sabre"],ranged:["bow_short","bow_composite"],shield:["shield_steppe"],armor:["leather","lamellar"],helmet:["steppe_helm"],horse:["steppe_horse"]},up:["kag_veteran_archer"]}),kag_veteran_archer:Jt({name:"\u0412\u0435\u0442\u0435\u0440\u0430\u043D \u043A\u0456\u043D\u043D\u0438\u0439 \u043B\u0443\u0447\u043D\u0438\u043A",faction:"kaganate",tier:4,type:"harch",hp:68,ms:5,rs:9,rd:9,eq:{melee:["sabre"],ranged:["bow_composite"],shield:["shield_steppe"],armor:["lamellar"],helmet:["steppe_helm"],horse:["courser","steppe_horse"]}}),kag_horseman:Jt({name:"\u0412\u0435\u0440\u0448\u043D\u0438\u043A \u041A\u0430\u0433\u0430\u043D\u0430\u0442\u0443",faction:"kaganate",tier:2,type:"cav",hp:54,ms:4,rd:5,eq:{melee:["sabre","spear"],ranged:[null,"javelins"],shield:["shield_steppe"],armor:["leather"],helmet:["leather_cap","steppe_helm"],horse:["steppe_horse"]},up:["kag_lancer"]}),kag_lancer:Jt({name:"\u0423\u043B\u0430\u043D\u0438\u043D \u041A\u0430\u0433\u0430\u043D\u0430\u0442\u0443",faction:"kaganate",tier:3,type:"cav",hp:64,ms:6,rd:7,eq:{melee:["lance","sabre"],shield:["shield_steppe"],armor:["lamellar"],helmet:["steppe_helm"],horse:["courser","hunter"]},up:["kag_bahadur"]}),kag_bahadur:Jt({name:"\u0411\u0430\u0433\u0430\u0442\u0443\u0440",faction:"kaganate",tier:5,type:"cav",hp:82,ms:9,rs:6,rd:10,eq:{melee:["lance","sabre","mace_iron"],ranged:["bow_composite"],shield:["shield_steppe"],armor:["lamellar","brigandine"],helmet:["steppe_helm"],horse:["destrier","courser"]}}),rodan_recruit:Jt({name:"\u041D\u043E\u0432\u043E\u0431\u0440\u0430\u043D\u0435\u0446\u044C \u0420\u043E\u0434\u0430\u043D\u0456",faction:"rodan",tier:1,type:"inf",hp:45,ms:2,eq:{melee:["pitchfork","spear","club"],armor:["tunic"],helmet:[null,"hood"]},up:["rodan_spearman","rodan_crossbowman"]}),rodan_spearman:Jt({name:"\u0420\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043D\u043E\u0441\u0435\u0446\u044C",faction:"rodan",tier:2,type:"inf",hp:56,ms:4,eq:{melee:["spear"],shield:["shield_wood","pavise"],armor:["padded"],helmet:["leather_cap"]},up:["rodan_trained_spearman"]}),rodan_trained_spearman:Jt({name:"\u0414\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043D\u043E\u0441\u0435\u0446\u044C",faction:"rodan",tier:3,type:"inf",hp:65,ms:6,eq:{melee:["spear_war"],shield:["pavise"],armor:["gambeson"],helmet:["kettle"]},up:["rodan_veteran_spearman","rodan_horseman"]}),rodan_veteran_spearman:Jt({name:"\u0412\u0435\u0442\u0435\u0440\u0430\u043D-\u0441\u043F\u0438\u0441\u043E\u043D\u043E\u0441\u0435\u0446\u044C",faction:"rodan",tier:4,type:"inf",hp:74,ms:8,eq:{melee:["spear_war","sword_arming"],shield:["pavise"],armor:["mail_shirt"],helmet:["kettle"]},up:["rodan_sotnyk"]}),rodan_sotnyk:Jt({name:"\u0420\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u0441\u043E\u0442\u043D\u0438\u043A",faction:"rodan",tier:5,type:"inf",hp:86,ms:9,eq:{melee:["spear_war","sword_fine","flail"],shield:["pavise"],armor:["hauberk","brigandine"],helmet:["kettle","great_helm"]}}),rodan_crossbowman:Jt({name:"\u0420\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A",faction:"rodan",tier:2,type:"arch",hp:52,ms:3,rs:5,eq:{melee:["club","cleaver"],ranged:["crossbow_light"],armor:["padded"],helmet:["leather_cap"]},up:["rodan_trained_crossbow"]}),rodan_trained_crossbow:Jt({name:"\u0414\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A",faction:"rodan",tier:3,type:"arch",hp:60,ms:4,rs:7,eq:{melee:["sword_short"],ranged:["crossbow_light","crossbow"],shield:["pavise"],armor:["gambeson"],helmet:["kettle"]},up:["rodan_sharpshooter"]}),rodan_sharpshooter:Jt({name:"\u0420\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u0441\u043D\u0430\u0439\u043F\u0435\u0440",faction:"rodan",tier:4,type:"arch",hp:68,ms:5,rs:9,eq:{melee:["sword_arming"],ranged:["crossbow"],shield:["pavise"],armor:["mail_shirt"],helmet:["kettle"]}}),rodan_horseman:Jt({name:"\u0420\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u0432\u0435\u0440\u0448\u043D\u0438\u043A",faction:"rodan",tier:4,type:"cav",hp:70,ms:7,rd:7,eq:{melee:["lance","sword_arming"],shield:["shield_heater"],armor:["mail_shirt"],helmet:["nasal"],horse:["hunter"]}}),looter:Jt({name:"\u041C\u0430\u0440\u043E\u0434\u0435\u0440",faction:"bandits",tier:1,type:"inf",hp:40,ms:2,eq:{melee:["club","cleaver","pitchfork"],armor:["tunic"],helmet:[null,"hood"]}}),forest_bandit:Jt({name:"\u041B\u0456\u0441\u043E\u0432\u0438\u0439 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A",faction:"bandits",tier:2,type:"arch",hp:50,ms:3,rs:5,eq:{melee:["axe_hand","club"],ranged:["bow_hunting"],armor:["leather","tunic"],helmet:["hood"]}}),steppe_bandit:Jt({name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u0439 \u0433\u0440\u0430\u0431\u0456\u0436\u043D\u0438\u043A",faction:"bandits",tier:2,type:"harch",hp:50,ms:3,rs:4,rd:5,eq:{melee:["sabre","cleaver"],ranged:["bow_short"],armor:["leather"],helmet:["fur_hat"],horse:["steppe_horse"]}}),mountain_bandit:Jt({name:"\u0413\u0456\u0440\u0441\u044C\u043A\u0438\u0439 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A",faction:"bandits",tier:2,type:"inf",hp:55,ms:4,eq:{melee:["spear","axe_hand"],ranged:["javelins"],shield:["shield_wood"],armor:["padded"],helmet:["leather_cap"]}}),sea_raider:Jt({name:"\u041C\u043E\u0440\u0441\u044C\u043A\u0438\u0439 \u0440\u0435\u0439\u0434\u0435\u0440",faction:"bandits",tier:3,type:"inf",hp:64,ms:6,eq:{melee:["axe_war","sword_short"],ranged:["throwing_axes"],shield:["shield_round"],armor:["mail_shirt","leather"],helmet:["nasal"]}}),deserter:Jt({name:"\u0414\u0435\u0437\u0435\u0440\u0442\u0438\u0440",faction:"bandits",tier:3,type:"inf",hp:60,ms:5,rs:4,eq:{melee:["sword_short","spear"],ranged:[null,"crossbow_light"],shield:["shield_kite",null],armor:["gambeson"],helmet:["kettle","leather_cap"]}}),merc_footman:Jt({name:"\u041D\u0430\u0439\u043C\u0430\u043D\u0438\u0439 \u043F\u0456\u0445\u043E\u0442\u0438\u043D\u0435\u0446\u044C",faction:"mercs",tier:3,type:"inf",hp:66,ms:6,eq:{melee:["sword_arming","axe_war","mace_iron"],shield:["shield_heater","shield_kite"],armor:["mail_shirt"],helmet:["nasal","kettle"]},up:["merc_sword_sister"]}),merc_sword_sister:Jt({name:"\u041D\u0430\u0439\u043C\u0430\u043D\u0438\u0439 \u043C\u0435\u0447\u043D\u0438\u043A",faction:"mercs",tier:4,type:"inf",hp:76,ms:8,eq:{melee:["greatsword","sword_fine"],shield:[null],armor:["hauberk"],helmet:["great_helm"]}}),merc_crossbow:Jt({name:"\u041D\u0430\u0439\u043C\u0430\u043D\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A",faction:"mercs",tier:3,type:"arch",hp:60,ms:4,rs:7,eq:{melee:["sword_short"],ranged:["crossbow_light"],armor:["gambeson"],helmet:["kettle"]}}),merc_cavalry:Jt({name:"\u041D\u0430\u0439\u043C\u0430\u043D\u0438\u0439 \u0432\u0435\u0440\u0448\u043D\u0438\u043A",faction:"mercs",tier:4,type:"cav",hp:72,ms:7,rd:7,eq:{melee:["sword_arming","lance"],shield:["shield_heater"],armor:["hauberk"],helmet:["nasal"],horse:["hunter","courser"]}}),caravan_guard:Jt({name:"\u041E\u0445\u043E\u0440\u043E\u043D\u0435\u0446\u044C \u043A\u0430\u0440\u0430\u0432\u0430\u043D\u0443",faction:"mercs",tier:3,type:"cav",hp:62,ms:5,rd:5,eq:{melee:["sword_short","spear"],shield:["shield_kite"],armor:["leather","mail_shirt"],helmet:["leather_cap","nasal"],horse:["sumpter","hunter"]},up:["merc_cavalry"]}),watchman:Jt({name:"\u041C\u0456\u0441\u044C\u043A\u0438\u0439 \u0432\u0430\u0440\u0442\u043E\u0432\u0438\u0439",faction:"mercs",tier:2,type:"inf",hp:56,ms:4,rs:3,eq:{melee:["spear","club"],ranged:[null,"crossbow_light"],shield:["shield_wood"],armor:["padded"],helmet:["kettle"]},up:["merc_footman","merc_crossbow"]})};for(let[s,t]of Object.entries(Gt)){t.id=s;let e=t.type==="cav"||t.type==="harch";t.mounted=e,t.wage=Math.round([0,3,6,11,20,32][t.tier]*(e?1.5:1)),t.upgradeXp=[0,40,110,240,420,9999][t.tier],t.upgradeCost=[0,10,30,70,150,0][t.tier],t.power=(4+t.tier*4+t.hp/12)*(e?1.3:1)}var Yu={velmar:"velmar_recruit",nordheim:"nord_recruit",kaganate:"kag_tribesman",rodan:"rodan_recruit"},Mh={velmar:["velmar_recruit","velmar_militia","velmar_footman","velmar_sergeant","velmar_crossbow","velmar_sharpshooter","velmar_squire","velmar_manatarms","velmar_knight"],nordheim:["nord_recruit","nord_footman","nord_trained","nord_veteran","nord_huscarl","nord_hunter","nord_archer","nord_veteran_archer"],kaganate:["kag_tribesman","kag_skirmisher","kag_horse_archer","kag_veteran_archer","kag_horseman","kag_lancer","kag_bahadur"],rodan:["rodan_recruit","rodan_spearman","rodan_trained_spearman","rodan_veteran_spearman","rodan_sotnyk","rodan_crossbowman","rodan_trained_crossbow","rodan_sharpshooter","rodan_horseman"]},Zu=["merc_footman","merc_crossbow","merc_cavalry","caravan_guard","watchman"],Vr={inf:"\u041F\u0456\u0445\u043E\u0442\u0430",arch:"\u0421\u0442\u0440\u0456\u043B\u044C\u0446\u0456",cav:"\u041A\u0456\u043D\u043D\u043E\u0442\u0430",harch:"\u041A\u0456\u043D\u043D\u0456 \u0441\u0442\u0440\u0456\u043B\u044C\u0446\u0456"};function Ma(s,t,e=5,n=1){let i=Mh[t].filter(r=>Gt[r].tier<=e&&Gt[r].tier>=n);return s.weighted(i.map(r=>[r,6-Gt[r].tier]))}var Ze=s=>({type:"weapon",slot:"melee",speed:1,reach:.9,...s}),Oi=s=>({type:"weapon",slot:"ranged",reload:0,mounted:!0,...s}),wt={club:Ze({name:"\u041A\u0438\u0439\u043E\u043A",cls:"mace",model:"club",swing:[16,"blunt"],reach:.8,speed:1,dirs:["left","right","overhead"],price:20}),cleaver:Ze({name:"\u0422\u0435\u0441\u0430\u043A",cls:"sword",model:"cleaver",swing:[19,"cut"],reach:.7,speed:1.05,dirs:["left","right","overhead"],price:35}),pitchfork:Ze({name:"\u0412\u0438\u043B\u0430",cls:"spear",model:"pitchfork",thrust:[18,"pierce"],swing:[10,"blunt"],reach:1.6,speed:.95,dirs:["thrust","overhead"],price:15}),sword_short:Ze({name:"\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043C\u0435\u0447",cls:"sword",model:"sword",swing:[22,"cut"],thrust:[18,"pierce"],reach:.85,speed:1.1,dirs:["left","right","overhead","thrust"],price:120}),sword_arming:Ze({name:"\u041B\u0438\u0446\u0430\u0440\u0441\u044C\u043A\u0438\u0439 \u043C\u0435\u0447",cls:"sword",model:"sword",swing:[27,"cut"],thrust:[22,"pierce"],reach:.95,speed:1,dirs:["left","right","overhead","thrust"],price:320}),sword_fine:Ze({name:"\u041C\u0435\u0447 \u043C\u0430\u0439\u0441\u0442\u0440\u0430",cls:"sword",model:"sword_long",swing:[31,"cut"],thrust:[25,"pierce"],reach:1,speed:1.03,dirs:["left","right","overhead","thrust"],price:750}),sabre:Ze({name:"\u0428\u0430\u0431\u043B\u044F",cls:"sword",model:"sabre",swing:[29,"cut"],reach:.95,speed:1.12,dirs:["left","right","overhead"],price:380}),axe_hand:Ze({name:"\u0421\u043E\u043A\u0438\u0440\u0430",cls:"axe",model:"axe",swing:[27,"cut"],reach:.75,speed:.98,dirs:["left","right","overhead"],price:110}),axe_war:Ze({name:"\u0411\u043E\u0439\u043E\u0432\u0430 \u0441\u043E\u043A\u0438\u0440\u0430",cls:"axe",model:"axe_war",swing:[33,"cut"],reach:.85,speed:.95,dirs:["left","right","overhead"],price:360}),mace_iron:Ze({name:"\u0411\u0443\u043B\u0430\u0432\u0430",cls:"mace",model:"mace",swing:[25,"blunt"],reach:.8,speed:.98,dirs:["left","right","overhead"],price:260}),flail:Ze({name:"\u0428\u0435\u0441\u0442\u043E\u043F\u0435\u0440",cls:"mace",model:"mace",swing:[30,"blunt"],reach:.85,speed:.96,dirs:["left","right","overhead"],price:520}),spear:Ze({name:"\u0421\u043F\u0438\u0441",cls:"spear",model:"spear",thrust:[28,"pierce"],swing:[16,"blunt"],reach:1.9,speed:.92,dirs:["thrust","overhead"],price:90}),spear_war:Ze({name:"\u0420\u043E\u0433\u0430\u0442\u0438\u043D\u0430",cls:"spear",model:"spear",thrust:[33,"pierce"],swing:[18,"blunt"],reach:1.9,speed:.93,dirs:["thrust","overhead"],price:260}),lance:Ze({name:"\u041A\u0456\u043D\u043D\u0438\u0439 \u0441\u043F\u0438\u0441",cls:"lance",model:"lance",thrust:[30,"pierce"],reach:2.6,speed:.85,dirs:["thrust"],price:300,lance:!0}),greatsword:Ze({name:"\u0414\u0432\u043E\u0440\u0443\u0447\u043D\u0438\u0439 \u043C\u0435\u0447",cls:"twohand",model:"greatsword",swing:[38,"cut"],thrust:[30,"pierce"],reach:1.2,speed:.9,twoHanded:!0,dirs:["left","right","overhead","thrust"],price:950}),greataxe:Ze({name:"\u0414\u0432\u043E\u0440\u0443\u0447\u043D\u0430 \u0441\u043E\u043A\u0438\u0440\u0430",cls:"twohand",model:"greataxe",swing:[43,"cut"],reach:1.05,speed:.85,twoHanded:!0,dirs:["left","right","overhead"],price:680}),train_sword:Ze({name:"\u0422\u0440\u0435\u043D\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u0439 \u043C\u0435\u0447",cls:"sword",model:"sword",swing:[20,"blunt"],thrust:[16,"blunt"],reach:.95,speed:1.05,dirs:["left","right","overhead","thrust"],price:30,training:!0}),train_spear:Ze({name:"\u0422\u0440\u0435\u043D\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u0439 \u0441\u043F\u0438\u0441",cls:"spear",model:"spear",thrust:[20,"blunt"],swing:[12,"blunt"],reach:1.8,speed:.95,dirs:["thrust","overhead"],price:30,training:!0}),train_greatsword:Ze({name:"\u0422\u0440\u0435\u043D\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0432\u043E\u0440\u0443\u0447\u043D\u0438\u043A",cls:"twohand",model:"greatsword",swing:[26,"blunt"],thrust:[20,"blunt"],reach:1.15,speed:.92,twoHanded:!0,dirs:["left","right","overhead","thrust"],price:40,training:!0}),bow_hunting:Oi({name:"\u041C\u0438\u0441\u043B\u0438\u0432\u0441\u044C\u043A\u0438\u0439 \u043B\u0443\u043A",cls:"bow",model:"bow",dmg:20,dtype:"pierce",ammo:30,projSpeed:48,draw:.8,acc:.82,price:80}),bow_short:Oi({name:"\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043B\u0443\u043A",cls:"bow",model:"bow_short",dmg:23,dtype:"pierce",ammo:30,projSpeed:52,draw:.75,acc:.86,price:180}),bow_long:Oi({name:"\u0414\u043E\u0432\u0433\u0438\u0439 \u043B\u0443\u043A",cls:"bow",model:"bow_long",dmg:29,dtype:"pierce",ammo:28,projSpeed:62,draw:1,acc:.9,price:450,mounted:!1}),bow_composite:Oi({name:"\u041A\u043E\u043C\u043F\u043E\u0437\u0438\u0442\u043D\u0438\u0439 \u043B\u0443\u043A",cls:"bow",model:"bow_short",dmg:27,dtype:"pierce",ammo:30,projSpeed:58,draw:.8,acc:.9,price:620}),crossbow_light:Oi({name:"\u041B\u0435\u0433\u043A\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442",cls:"crossbow",model:"crossbow",dmg:38,dtype:"pierce",ammo:22,projSpeed:64,draw:.3,reload:2.2,acc:.93,price:260}),crossbow:Oi({name:"\u0412\u0430\u0436\u043A\u0438\u0439 \u0430\u0440\u0431\u0430\u043B\u0435\u0442",cls:"crossbow",model:"crossbow",dmg:52,dtype:"pierce",ammo:20,projSpeed:72,draw:.3,reload:3.2,acc:.95,price:540,mounted:!1}),javelins:Oi({name:"\u0414\u0440\u043E\u0442\u0438\u043A\u0438",cls:"throw",model:"javelin",dmg:34,dtype:"pierce",ammo:5,projSpeed:27,draw:.5,acc:.85,price:150}),throwing_axes:Oi({name:"\u041C\u0435\u0442\u0430\u043B\u044C\u043D\u0456 \u0441\u043E\u043A\u0438\u0440\u0438",cls:"throw",model:"throwaxe",dmg:38,dtype:"cut",ammo:4,projSpeed:22,draw:.5,acc:.82,price:210}),shield_wood:{type:"shield",slot:"shield",name:"\u0414\u0435\u0440\u0435\u0432\u2019\u044F\u043D\u0438\u0439 \u0449\u0438\u0442",model:"round",size:.5,arc:1.3,price:40,color:"#8b5a2b"},shield_round:{type:"shield",slot:"shield",name:"\u041A\u0440\u0443\u0433\u043B\u0438\u0439 \u0449\u0438\u0442",model:"round",size:.6,arc:1.45,price:130,color:"#9c6b3a"},shield_steppe:{type:"shield",slot:"shield",name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u0439 \u0449\u0438\u0442",model:"round",size:.42,arc:1.2,price:90,color:"#7a4a24"},shield_kite:{type:"shield",slot:"shield",name:"\u041C\u0438\u0433\u0434\u0430\u043B\u0435\u0432\u0438\u0434\u043D\u0438\u0439 \u0449\u0438\u0442",model:"kite",size:.62,arc:1.5,price:220,color:"#b8b8b8"},shield_heater:{type:"shield",slot:"shield",name:"\u0413\u0435\u0440\u0431\u043E\u0432\u0438\u0439 \u0449\u0438\u0442",model:"heater",size:.55,arc:1.45,price:300,color:"#c9c9c9"},pavise:{type:"shield",slot:"shield",name:"\u041F\u0430\u0432\u0435\u0437\u0430",model:"pavise",size:.75,arc:1.6,price:360,color:"#6b8e4e"},tunic:{type:"armor",slot:"armor",name:"\u041F\u043E\u043B\u043E\u0442\u043D\u044F\u043D\u0430 \u0441\u043E\u0440\u043E\u0447\u043A\u0430",armor:4,look:"cloth",price:12},padded:{type:"armor",slot:"armor",name:"\u0421\u0442\u044C\u043E\u0431\u0430\u043D\u0438\u0439 \u043A\u0430\u043F\u0442\u0430\u043D",armor:12,look:"padded",price:90},leather:{type:"armor",slot:"armor",name:"\u0428\u043A\u0456\u0440\u044F\u043D\u0430 \u043A\u0443\u0440\u0442\u043A\u0430",armor:16,look:"leather",price:180},gambeson:{type:"armor",slot:"armor",name:"\u0413\u0430\u043C\u0431\u0435\u0437\u043E\u043D",armor:19,look:"padded",price:260},mail_shirt:{type:"armor",slot:"armor",name:"\u041A\u043E\u043B\u044C\u0447\u0443\u0436\u043D\u0430 \u0441\u043E\u0440\u043E\u0447\u043A\u0430",armor:26,look:"mail",price:620},lamellar:{type:"armor",slot:"armor",name:"\u041B\u0430\u043C\u0435\u043B\u044F\u0440\u043D\u0438\u0439 \u043E\u0431\u043B\u0430\u0434\u0443\u043D\u043E\u043A",armor:30,look:"lamellar",price:900},hauberk:{type:"armor",slot:"armor",name:"\u041A\u043E\u043B\u044C\u0447\u0443\u0436\u043D\u0438\u0439 \u0445\u0430\u0443\u0431\u0435\u0440\u043A",armor:33,look:"mail",price:1150},brigandine:{type:"armor",slot:"armor",name:"\u0411\u0440\u0438\u0433\u0430\u043D\u0442\u0438\u043D\u0430",armor:39,look:"plate",price:1900},plate:{type:"armor",slot:"armor",name:"\u041B\u0430\u0442\u043D\u0438\u0439 \u043E\u0431\u043B\u0430\u0434\u0443\u043D\u043E\u043A",armor:47,look:"plate",price:3600},hood:{type:"helmet",slot:"helmet",name:"\u041A\u0430\u043F\u0442\u0443\u0440",armor:3,look:"hood",price:10},fur_hat:{type:"helmet",slot:"helmet",name:"\u0425\u0443\u0442\u0440\u044F\u043D\u0430 \u0448\u0430\u043F\u043A\u0430",armor:6,look:"fur",price:40},leather_cap:{type:"helmet",slot:"helmet",name:"\u0428\u043A\u0456\u0440\u044F\u043D\u0438\u0439 \u0448\u043E\u043B\u043E\u043C",armor:10,look:"cap",price:70},nasal:{type:"helmet",slot:"helmet",name:"\u0428\u043E\u043B\u043E\u043C \u0437 \u043D\u0430\u043D\u043E\u0441\u043D\u0438\u043A\u043E\u043C",armor:18,look:"nasal",price:220},spangen:{type:"helmet",slot:"helmet",name:"\u0421\u043F\u0430\u043D\u0433\u0435\u043D\u0433\u0435\u043B\u044C\u043C",armor:21,look:"spangen",price:320},kettle:{type:"helmet",slot:"helmet",name:"\u041A\u0430\u043F\u0435\u043B\u044E\u0445-\u0448\u043E\u043B\u043E\u043C",armor:22,look:"kettle",price:350},steppe_helm:{type:"helmet",slot:"helmet",name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u0439 \u0448\u043E\u043B\u043E\u043C",armor:20,look:"spiked",price:300},great_helm:{type:"helmet",slot:"helmet",name:"\u0412\u0435\u043B\u0438\u043A\u0438\u0439 \u0448\u043E\u043B\u043E\u043C",armor:31,look:"great",price:850},sumpter:{type:"horse",slot:"horse",name:"\u0412\u2019\u044E\u0447\u043D\u0430 \u043A\u043E\u043D\u044F\u0447\u043A\u0430",speed:9,hp:70,armor:4,maneuver:.85,price:160,coat:"#7b5a3c"},steppe_horse:{type:"horse",slot:"horse",name:"\u0421\u0442\u0435\u043F\u043E\u0432\u0438\u0439 \u043A\u0456\u043D\u044C",speed:11.5,hp:85,armor:6,maneuver:1.25,price:360,coat:"#b08850"},courser:{type:"horse",slot:"horse",name:"\u0421\u043A\u0430\u043A\u0443\u043D",speed:13,hp:95,armor:8,maneuver:1.15,price:720,coat:"#3a2a20"},hunter:{type:"horse",slot:"horse",name:"\u041C\u0438\u0441\u043B\u0438\u0432\u0441\u044C\u043A\u0438\u0439 \u043A\u0456\u043D\u044C",speed:11.2,hp:115,armor:12,maneuver:1.05,price:620,coat:"#5b3b25"},destrier:{type:"horse",slot:"horse",name:"\u0411\u043E\u0439\u043E\u0432\u0438\u0439 \u043A\u0456\u043D\u044C",speed:10.6,hp:150,armor:26,maneuver:.95,price:1650,coat:"#dcdcdc",barding:!0},charger:{type:"horse",slot:"horse",name:"\u041B\u0438\u0446\u0430\u0440\u0441\u044C\u043A\u0438\u0439 \u043A\u0456\u043D\u044C",speed:10.2,hp:185,armor:40,maneuver:.9,price:2900,coat:"#222222",barding:!0},grain:{type:"food",name:"\u0417\u0435\u0440\u043D\u043E",servings:40,morale:0,price:24},bread:{type:"food",name:"\u0425\u043B\u0456\u0431",servings:35,morale:1,price:32},fish:{type:"food",name:"\u0421\u0443\u0448\u0435\u043D\u0430 \u0440\u0438\u0431\u0430",servings:35,morale:1,price:38},cheese:{type:"food",name:"\u0421\u0438\u0440",servings:30,morale:2,price:48},meat:{type:"food",name:"\u0412\u2019\u044F\u043B\u0435\u043D\u0435 \u043C\u2019\u044F\u0441\u043E",servings:30,morale:3,price:58},honey:{type:"food",name:"\u041C\u0435\u0434",servings:20,morale:3,price:72},salt:{type:"good",name:"\u0421\u0456\u043B\u044C",price:120},iron:{type:"good",name:"\u0417\u0430\u043B\u0456\u0437\u043E",price:180},wine:{type:"good",name:"\u0412\u0438\u043D\u043E",price:230},furs:{type:"good",name:"\u0425\u0443\u0442\u0440\u043E",price:300},cloth:{type:"good",name:"\u0422\u043A\u0430\u043D\u0438\u043D\u0430",price:150},spices:{type:"good",name:"\u041F\u0440\u044F\u043D\u043E\u0449\u0456",price:460},tools:{type:"good",name:"\u0406\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438",price:250},pottery:{type:"good",name:"\u041A\u0435\u0440\u0430\u043C\u0456\u043A\u0430",price:100},wool:{type:"good",name:"\u0412\u043E\u0432\u043D\u0430",price:110},oil:{type:"good",name:"\u041E\u043B\u0456\u044F",price:200},cargo:{type:"quest",name:"\u041E\u043F\u0435\u0447\u0430\u0442\u0430\u043D\u0438\u0439 \u0432\u0430\u043D\u0442\u0430\u0436",price:0}};for(let[s,t]of Object.entries(wt))t.id=s;var Bi=Object.keys(wt).filter(s=>wt[s].type==="food"),ds=Object.keys(wt).filter(s=>wt[s].type==="good");function Hs(s){let t=wt[s];return!!t&&["weapon","shield","armor","helmet","horse"].includes(t.type)}function us(s){if(!s)return"";switch(s.type){case"weapon":if(s.slot==="ranged")return`\u0428\u043A\u043E\u0434\u0430 ${s.dmg} \xB7 \u0411\u043E\u0454\u0437\u0430\u043F\u0430\u0441 ${s.ammo} \xB7 \u0422\u043E\u0447\u043D\u0456\u0441\u0442\u044C ${Math.round(s.acc*100)}%${s.reload?` \xB7 \u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430 ${s.reload}\u0441`:""}${s.mounted?"":" \xB7 \u0422\u0456\u043B\u044C\u043A\u0438 \u043F\u0456\u0448\u0438\u043C"}`;{let t=[];return s.swing&&t.push(`\u0423\u0434\u0430\u0440 ${s.swing[0]}`),s.thrust&&t.push(`\u0423\u043A\u043E\u043B ${s.thrust[0]}`),t.push(`\u0414\u043E\u0432\u0436\u0438\u043D\u0430 ${s.reach.toFixed(1)}\u043C`),s.twoHanded&&t.push("\u0414\u0432\u043E\u0440\u0443\u0447\u043D\u0430"),t.join(" \xB7 ")}case"shield":return`\u0429\u0438\u0442 \xB7 \u0440\u043E\u0437\u043C\u0456\u0440 ${Math.round(s.size*100)}`;case"armor":case"helmet":return`\u0417\u0430\u0445\u0438\u0441\u0442 ${s.armor}`;case"horse":return`\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C ${s.speed} \xB7 \u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F ${s.hp} \xB7 \u0411\u0440\u043E\u043D\u044F ${s.armor}`;case"food":return`${s.servings} \u043F\u043E\u0440\u0446\u0456\u0439${s.morale?` \xB7 +${s.morale} \u043C\u043E\u0440\u0430\u043B\u044C`:""}`;case"good":return"\u0422\u043E\u0432\u0430\u0440 \u0434\u043B\u044F \u0442\u043E\u0440\u0433\u0456\u0432\u043B\u0456";case"quest":return"\u0412\u0430\u043D\u0442\u0430\u0436 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438";default:return""}}var ri={borys:{name:"\u0411\u043E\u0440\u0438\u0441 \u0421\u0456\u0440\u0438\u0439",story:"\u041A\u043E\u043B\u0438\u0448\u043D\u0456\u0439 \u0441\u043E\u0442\u043D\u0438\u043A \u0440\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u043E\u0457 \u0432\u0430\u0440\u0442\u0438. \u041A\u0430\u0436\u0435, \u0449\u043E \u0439\u043E\u0433\u043E \u0432\u0438\u0433\u043D\u0430\u043B\u0438 \u0437\u0430 \u043D\u0430\u0434\u0442\u043E \u0447\u0435\u0441\u043D\u0438\u0439 \u044F\u0437\u0438\u043A.",level:6,hp:72,cost:450,skills:{tactics:3,trainer:3,ironflesh:2,power_strike:2},equipment:{w1:"spear_war",w2:"sword_short",w3:null,shield:"pavise",armor:"mail_shirt",helmet:"kettle",horse:null}},lesia:{name:"\u041B\u0435\u0441\u044F \u0422\u0440\u0430\u0432\u043D\u0438\u0446\u044F",story:"\u0417\u043D\u0430\u0445\u0430\u0440\u043A\u0430 \u0437 \u043B\u0456\u0441\u043E\u0432\u043E\u0433\u043E \u0445\u0443\u0442\u043E\u0440\u0430. \u0417\u0430\u0448\u0438\u0454 \u0431\u0443\u0434\u044C-\u044F\u043A\u0443 \u0440\u0430\u043D\u0443 \u2014 \u0456 \u0432\u043B\u0443\u0447\u0438\u0442\u044C \u0431\u0456\u043B\u0446\u0456 \u0432 \u043E\u043A\u043E \u0437 \u0441\u043E\u0440\u043E\u043A\u0430 \u043A\u0440\u043E\u043A\u0456\u0432.",level:4,hp:55,cost:300,skills:{surgery:4,power_draw:2,pathfinding:2},equipment:{w1:"bow_hunting",w2:"cleaver",w3:null,shield:null,armor:"leather",helmet:"hood",horse:"sumpter"}},torvi:{name:"\u0422\u043E\u0440\u0432\u0456 \u0412\u0435\u0434\u043C\u0435\u0436\u0430 \u041B\u0430\u043F\u0430",story:"\u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0441\u044C\u043A\u0438\u0439 \u0432\u043E\u0457\u043D, \u0449\u043E \u043F\u0440\u043E\u0433\u0440\u0430\u0432 \u0443 \u043A\u043E\u0441\u0442\u0456 \u0441\u0432\u0456\u0439 \u043A\u043E\u0440\u0430\u0431\u0435\u043B\u044C. \u0428\u0443\u043A\u0430\u0454 \u043D\u043E\u0432\u0443 \u0431\u0438\u0442\u0432\u0443.",level:7,hp:85,cost:600,skills:{ironflesh:4,power_strike:4,athletics:2},equipment:{w1:"greataxe",w2:"throwing_axes",w3:null,shield:"shield_round",armor:"mail_shirt",helmet:"spangen",horse:null}},aibek:{name:"\u0410\u0439\u0431\u0435\u043A \u0412\u0456\u0442\u0435\u0440",story:"\u0421\u0438\u043D \u0441\u0442\u0435\u043F\u043E\u0432\u043E\u0433\u043E \u0431\u0435\u043A\u0430, \u0432\u0442\u0456\u043A\u0430\u0447 \u0432\u0456\u0434 \u043A\u0440\u043E\u0432\u043D\u043E\u0457 \u043F\u043E\u043C\u0441\u0442\u0438. \u041D\u0430\u0440\u043E\u0434\u0438\u0432\u0441\u044F \u0432 \u0441\u0456\u0434\u043B\u0456.",level:5,hp:62,cost:500,skills:{riding:4,power_draw:3,pathfinding:3},equipment:{w1:"bow_short",w2:"sabre",w3:null,shield:"shield_steppe",armor:"lamellar",helmet:"steppe_helm",horse:"steppe_horse"}},hilda:{name:"\u0413\u0456\u043B\u044C\u0434\u0430 \u0437 \u0410\u0440\u0434\u0435\u0439\u043D\u0443",story:"\u0414\u043E\u043D\u044C\u043A\u0430 \u043A\u0443\u043F\u0446\u044F, \u0449\u043E \u0432\u0442\u0435\u043A\u043B\u0430 \u0432\u0456\u0434 \u043D\u0430\u0432\u2019\u044F\u0437\u0430\u043D\u043E\u0433\u043E \u0448\u043B\u044E\u0431\u0443. \u0420\u0430\u0445\u0443\u0454 \u043A\u0440\u0430\u0449\u0435 \u0437\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u043E\u0433\u043E \u043C\u0438\u0442\u043D\u0438\u043A\u0430.",level:3,hp:50,cost:250,skills:{trade:4,leadership:2,looting:2},equipment:{w1:"sword_short",w2:"crossbow_light",w3:null,shield:null,armor:"padded",helmet:"leather_cap",horse:"sumpter"}},ostap:{name:"\u041E\u0441\u0442\u0430\u043F \u0428\u0438\u0431\u0430\u0439\u0433\u043E\u043B\u043E\u0432\u0430",story:"\u0412\u0438\u0433\u043D\u0430\u043D\u0438\u0439 \u0437\u0456 \u0437\u0431\u0440\u043E\u0454\u043D\u043E\u0441\u0446\u0456\u0432 \u0437\u0430 \u0431\u0456\u0439\u043A\u0443 \u0437 \u043B\u0438\u0446\u0430\u0440\u0435\u043C. \u041B\u0438\u0446\u0430\u0440 \u0434\u043E\u0441\u0456 \u043D\u0435 \u043E\u0433\u043E\u0432\u0442\u0430\u0432\u0441\u044F.",level:5,hp:66,cost:400,skills:{riding:3,power_strike:3,looting:3},equipment:{w1:"sword_arming",w2:"lance",w3:null,shield:"shield_kite",armor:"gambeson",helmet:"nasal",horse:"hunter"}}};for(let[s,t]of Object.entries(ri))t.id=s;var Vs={str:{name:"\u0421\u0438\u043B\u0430",desc:"+1 \u0437\u0434\u043E\u0440\u043E\u0432\u2019\u044F \u0437\u0430 \u043E\u0447\u043A\u043E; \u043E\u0431\u043C\u0435\u0436\u0443\u0454 \u0441\u0438\u043B\u043E\u0432\u0456 \u043D\u0430\u0432\u0438\u0447\u043A\u0438."},agi:{name:"\u0421\u043F\u0440\u0438\u0442\u043D\u0456\u0441\u0442\u044C",desc:"\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u0430\u0442\u0430\u043A \u0456 \u0431\u0456\u0433\u0443; \u043E\u0431\u043C\u0435\u0436\u0443\u0454 \u043D\u0430\u0432\u0438\u0447\u043A\u0438 \u0441\u043F\u0440\u0438\u0442\u043D\u043E\u0441\u0442\u0456."},int:{name:"\u0406\u043D\u0442\u0435\u043B\u0435\u043A\u0442",desc:"+1 \u043E\u0447\u043A\u043E \u043D\u0430\u0432\u0438\u0447\u043E\u043A \u0437\u0430 \u043A\u043E\u0436\u043D\u0435 \u043E\u0447\u043A\u043E; \u043E\u0431\u043C\u0435\u0436\u0443\u0454 \u0456\u043D\u0442\u0435\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0456 \u043D\u0430\u0432\u0438\u0447\u043A\u0438."},cha:{name:"\u0425\u0430\u0440\u0438\u0437\u043C\u0430",desc:"+1 \u0434\u043E \u0440\u043E\u0437\u043C\u0456\u0440\u0443 \u0437\u0430\u0433\u043E\u043D\u0443; \u043E\u0431\u043C\u0435\u0436\u0443\u0454 \u043D\u0430\u0432\u0438\u0447\u043A\u0438 \u0445\u0430\u0440\u0438\u0437\u043C\u0438."}},zi={ironflesh:{name:"\u0417\u0430\u043B\u0456\u0437\u043D\u0430 \u0448\u043A\u0456\u0440\u0430",attr:"str",desc:"+3 \u0437\u0434\u043E\u0440\u043E\u0432\u2019\u044F \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},power_strike:{name:"\u041F\u043E\u0442\u0443\u0436\u043D\u0438\u0439 \u0443\u0434\u0430\u0440",attr:"str",desc:"+8% \u0448\u043A\u043E\u0434\u0438 \u0432 \u0431\u043B\u0438\u0436\u043D\u044C\u043E\u043C\u0443 \u0431\u043E\u044E \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},power_draw:{name:"\u041F\u043E\u0442\u0443\u0436\u043D\u0438\u0439 \u043F\u043E\u0441\u0442\u0440\u0456\u043B",attr:"str",desc:"+10% \u0448\u043A\u043E\u0434\u0438 \u043B\u0443\u043A\u043E\u043C/\u043C\u0435\u0442\u0430\u043B\u044C\u043D\u043E\u044E \u0437\u0431\u0440\u043E\u0454\u044E \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},athletics:{name:"\u0410\u0442\u043B\u0435\u0442\u0438\u043A\u0430",attr:"agi",desc:"+4% \u0448\u0432\u0438\u0434\u043A\u043E\u0441\u0442\u0456 \u0431\u0456\u0433\u0443 \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},riding:{name:"\u0412\u0435\u0440\u0445\u043E\u0432\u0430 \u0457\u0437\u0434\u0430",attr:"agi",desc:"+4% \u0448\u0432\u0438\u0434\u043A\u043E\u0441\u0442\u0456 \u0442\u0430 \u043A\u0435\u0440\u043E\u0432\u0430\u043D\u043E\u0441\u0442\u0456 \u043A\u043E\u043D\u044F \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},looting:{name:"\u041C\u0430\u0440\u043E\u0434\u0435\u0440\u0441\u0442\u0432\u043E",attr:"agi",desc:"+10% \u0437\u0434\u043E\u0431\u0438\u0447\u0456 \u043F\u0456\u0441\u043B\u044F \u0431\u0438\u0442\u0432 \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},trainer:{name:"\u0422\u0440\u0435\u043D\u0435\u0440",attr:"int",desc:"\u0429\u043E\u0434\u0435\u043D\u043D\u0438\u0439 \u0434\u043E\u0441\u0432\u0456\u0434 \u0434\u043B\u044F \u0432\u043E\u0457\u043D\u0456\u0432 \u0437\u0430\u0433\u043E\u043D\u0443."},tactics:{name:"\u0422\u0430\u043A\u0442\u0438\u043A\u0430",attr:"int",desc:"\u041F\u0435\u0440\u0435\u0432\u0430\u0433\u0430 \u0432 \u0430\u0432\u0442\u043E\u0431\u043E\u044F\u0445 \u0442\u0430 \u043F\u0440\u0438 \u0440\u043E\u0437\u0441\u0442\u0430\u043D\u043E\u0432\u0446\u0456 \u0441\u0438\u043B."},surgery:{name:"\u0425\u0456\u0440\u0443\u0440\u0433\u0456\u044F",attr:"int",desc:"+5% \u0448\u0430\u043D\u0441\u0443, \u0449\u043E \u043F\u043E\u043B\u0435\u0433\u043B\u0438\u0439 \u0432\u043E\u0457\u043D \u043B\u0438\u0448\u0435 \u043F\u043E\u0440\u0430\u043D\u0435\u043D\u0438\u0439."},pathfinding:{name:"\u0421\u0442\u0435\u0436\u043E\u043F\u0440\u043E\u043A\u043B\u0430\u0434\u0430\u043D\u043D\u044F",attr:"int",desc:"+3% \u0448\u0432\u0438\u0434\u043A\u043E\u0441\u0442\u0456 \u0437\u0430\u0433\u043E\u043D\u0443 \u043D\u0430 \u043C\u0430\u043F\u0456 \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."},leadership:{name:"\u041B\u0456\u0434\u0435\u0440\u0441\u0442\u0432\u043E",attr:"cha",desc:"+5 \u0434\u043E \u0440\u043E\u0437\u043C\u0456\u0440\u0443 \u0437\u0430\u0433\u043E\u043D\u0443, \u043C\u043E\u0440\u0430\u043B\u044C, -5% \u043F\u043B\u0430\u0442\u043D\u0456."},trade:{name:"\u0422\u043E\u0440\u0433\u0456\u0432\u043B\u044F",attr:"cha",desc:"\u041A\u0440\u0430\u0449\u0456 \u0446\u0456\u043D\u0438 \u043D\u0430 \u0440\u0438\u043D\u043A\u0443."},prisoner:{name:"\u0422\u044E\u0440\u0435\u043C\u043D\u0438\u043A",attr:"cha",desc:"+5 \u0434\u043E \u043A\u0456\u043B\u044C\u043A\u043E\u0441\u0442\u0456 \u043F\u043E\u043B\u043E\u043D\u0435\u043D\u0438\u0445 \u0437\u0430 \u0440\u0456\u0432\u0435\u043D\u044C."}},Gs={knight:{name:"\u0417\u0431\u0456\u0434\u043D\u0456\u043B\u0438\u0439 \u043B\u0438\u0446\u0430\u0440",desc:"\u041C\u043E\u043B\u043E\u0434\u0448\u0438\u0439 \u0441\u0438\u043D \u0437\u0431\u0456\u0434\u043D\u0456\u043B\u043E\u0433\u043E \u0440\u043E\u0434\u0443. \u0414\u043E\u0431\u0440\u0438\u0439 \u043A\u0456\u043D\u044C, \u043C\u0435\u0447 \u0456 \u043A\u043E\u043B\u044C\u0447\u0443\u0433\u0430 \u2014 \u0443\u0441\u0435, \u0449\u043E \u0437\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044F \u0432\u0456\u0434 \u0441\u043F\u0430\u0434\u043A\u0443.",attrs:{str:2,agi:1},skills:{riding:2,power_strike:2,leadership:1,ironflesh:1},gold:350,equipment:{w1:"sword_arming",w2:"lance",w3:null,shield:"shield_heater",armor:"mail_shirt",helmet:"nasal",horse:"hunter"},inventory:[["grain",1]],troops:[]},hunter:{name:"\u041C\u0438\u0441\u043B\u0438\u0432\u0435\u0446\u044C",desc:"\u0412\u0438\u0440\u0456\u0441 \u0443 \u043B\u0456\u0441\u0430\u0445 \u0456 \u043F\u043E\u043B\u044E\u0432\u0430\u0432 \u0437 \u0431\u0430\u0442\u044C\u043A\u043E\u043C. \u0412\u043B\u0443\u0447\u043D\u0435 \u043E\u043A\u043E \u0442\u0430 \u0432\u0438\u0442\u0440\u0438\u0432\u0430\u043B\u0456 \u043D\u043E\u0433\u0438.",attrs:{agi:2,str:1},skills:{power_draw:3,athletics:2,pathfinding:1,looting:1},gold:300,equipment:{w1:"bow_hunting",w2:"axe_hand",w3:null,shield:null,armor:"leather",helmet:"fur_hat",horse:"sumpter"},inventory:[["meat",1],["furs",2]],troops:[]},merchant:{name:"\u041A\u0443\u043F\u0435\u0446\u044C\u043A\u0438\u0439 \u0441\u0438\u043D",desc:"\u0411\u0430\u0442\u044C\u043A\u0456\u0432\u0441\u044C\u043A\u0438\u0439 \u043A\u0430\u0440\u0430\u0432\u0430\u043D \u0437\u0430\u0433\u0438\u043D\u0443\u0432 \u0432\u0456\u0434 \u0440\u0443\u043A \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0456\u0432, \u0430\u043B\u0435 \u0437\u043E\u043B\u043E\u0442\u043E \u0442\u0430 \u0445\u0438\u0441\u0442 \u0434\u043E \u0442\u043E\u0440\u0433\u0456\u0432\u043B\u0456 \u043B\u0438\u0448\u0438\u043B\u0438\u0441\u044F.",attrs:{cha:2,int:1},skills:{trade:3,leadership:2,surgery:1},gold:1400,equipment:{w1:"sword_short",w2:null,w3:null,shield:"shield_wood",armor:"padded",helmet:"leather_cap",horse:"sumpter"},inventory:[["bread",1],["cloth",3]],troops:[["watchman",2]]},mercenary:{name:"\u041D\u0430\u0439\u043C\u0430\u043D\u0435\u0446\u044C",desc:"\u0420\u043E\u043A\u0430\u043C\u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0432 \u0441\u0432\u0456\u0439 \u043C\u0435\u0447 \u0442\u0438\u043C, \u0445\u0442\u043E \u0431\u0456\u043B\u044C\u0448\u0435 \u043F\u043B\u0430\u0442\u0438\u0432. \u0417\u043D\u0430\u0454 \u0446\u0456\u043D\u0443 \u043A\u0440\u043E\u0432\u0456 \u0442\u0430 \u0432\u0456\u0440\u043D\u0438\u0445 \u043F\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u0456\u0432.",attrs:{str:1,agi:1,cha:1},skills:{ironflesh:2,power_strike:1,athletics:1,leadership:1,tactics:1},gold:450,equipment:{w1:"axe_war",w2:"javelins",w3:null,shield:"shield_round",armor:"gambeson",helmet:"spangen",horse:null},inventory:[["grain",1]],troops:[["watchman",3],["merc_crossbow",1]]}},Ku={str:6,agi:6,int:5,cha:5};function Gr(s){return Math.round(300*Math.pow(s,1.55))}function Ju(s,t){let e=zi[t].attr;return Math.min(10,Math.floor(s.attrs[e]/3))}function Wn(s){return 50+s.attrs.str+s.skills.ironflesh*3}function ju(s){let t=s.player;return 10+t.skills.leadership*5+t.attrs.cha+Math.floor(t.renown/25)}function Qu(s){return 5+s.player.skills.prisoner*5}function hn(s,t){let e=s.player.skills[t]||0;for(let[n,i]of Object.entries(s.companions||{}))i.hired&&ri[n]&&(e=Math.max(e,ri[n].skills[t]||0));return e}function $n(s){return Object.entries(s.companions||{}).filter(([t,e])=>e.hired&&ri[t]).map(([t,e])=>({id:t,def:ri[t],st:e}))}function Ws(s){return s.level*8}function Hi(s){let t=cn(s),e=new Uint8Array(512),n=new Uint8Array(256);for(let a=0;a<256;a++)n[a]=a;for(let a=255;a>0;a--){let l=Math.floor(t()*(a+1)),c=n[a];n[a]=n[l],n[l]=c}for(let a=0;a<512;a++)e[a]=n[a&255];let i=new Float32Array(256),r=new Float32Array(256);for(let a=0;a<256;a++){let l=t()*Math.PI*2;i[a]=Math.cos(l),r[a]=Math.sin(l)}let o=a=>a*a*a*(a*(a*6-15)+10);return function(l,c){let h=Math.floor(l),d=Math.floor(c),u=l-h,f=c-d,p=h&255,g=d&255,m=e[p+e[g]],y=e[p+1+e[g]],x=e[p+e[g+1]],M=e[p+1+e[g+1]],v=i[m]*u+r[m]*f,S=i[y]*(u-1)+r[y]*f,T=i[x]*u+r[x]*(f-1),C=i[M]*(u-1)+r[M]*(f-1),_=o(u),A=o(f),R=v+_*(S-v),I=T+_*(C-T);return(R+A*(I-R))*1.41}}function fs(s,t,e,n=5,i=2,r=.5){let o=1,a=1,l=0,c=0;for(let h=0;h<n;h++)l+=s(t*a,e*a)*o,c+=o,o*=r,a*=i;return l/c}function tf(s,t,e,n=4){let i=.5,r=1,o=0;for(let a=0;a<n;a++){let l=1-Math.abs(s(t*r,e*r));o+=l*l*i,i*=.5,r*=2.1}return o}var Tn=3200,En=2200,Te=12,jM=Math.ceil(Tn/Te),QM=Math.ceil(En/Te),ae={WATER:0,BEACH:1,PLAINS:2,FOREST:3,STEPPE:4,DESERT:5,SNOW:6,TAIGA:7,MOUNTAIN:8,PEAK:9};var d0=[0,1,1,.72,1.05,.85,.8,.7,.55,0],ef=["plains","plains","plains","forest","steppe","desert","snow","taiga","hills","hills"],Wr=class{constructor(t){this.seed=t,this.nHeight=Hi(t),this.nRidge=Hi(t+11),this.nMask=Hi(t+23),this.nMoist=Hi(t+37),this.nTemp=Hi(t+51)}sample(t,e){let n=t/Tn,i=e/En,r=Tn/En,o=fs(this.nHeight,n*3.2*r,i*3.2,5)*1.05+.24,a=(n-.5)/.5,l=(i-.5)/.5,c=Math.pow(a**4+l**4,.25)+fs(this.nMask,n*4*r,i*4,4)*.22,h=Gn(1,.74,c);o=o*h-(1-h)*.6;let d=Gn(.08,.45,this.nMask(n*1.7+3.1,i*1.7-1.3)),u=tf(this.nRidge,n*4.5*r,i*4.5,4);if(o+=u*d*.95*h,o<=0)return[o,ae.WATER];if(o<.035)return[o,ae.BEACH];if(o>.86)return[o,ae.PEAK];if(o>.64)return[o,ae.MOUNTAIN];let f=fs(this.nMoist,n*5*r,i*5,4)*.7+.5-Gn(.55,.9,n)*.42*Gn(.25,.45,i),p=i+this.nTemp(n*4,i*4)*.08-o*.25;return p<.27?[o,f>.5?ae.TAIGA:ae.SNOW]:f<.3?[o,p>.8?ae.DESERT:ae.STEPPE]:f>.6?[o,ae.FOREST]:[o,ae.PLAINS]}field(t){let e=Math.ceil(Tn/t),n=Math.ceil(En/t),i=new Float32Array(e*n),r=new Uint8Array(e*n);for(let o=0;o<n;o++){let a=(o+.5)*t;for(let l=0;l<e;l++){let c=this.sample((l+.5)*t,a);i[o*e+l]=c[0],r[o*e+l]=c[1]}}return{w:e,h:n,step:t,height:i,biome:r}}},$r=class{constructor(t){let e=t.field(Te);this.w=e.w,this.h=e.h,this.height=e.height,this.biome=e.biome,this.speed=new Float32Array(this.w*this.h),this.road=new Uint8Array(this.w*this.h);for(let n=0;n<this.speed.length;n++)this.speed[n]=d0[this.biome[n]];this.labelRegions()}labelRegions(){let{w:t,h:e}=this;this.region=new Int32Array(t*e).fill(-1);let n=-1,i=0,r=0,o=[];for(let a=0;a<t*e;a++){if(this.region[a]!==-1||this.speed[a]<=0)continue;let l=0;for(o.push(a),this.region[a]=r;o.length;){let c=o.pop();l++;let h=c%t,d=c/t|0;for(let u=-1;u<=1;u++)for(let f=-1;f<=1;f++){if(!f&&!u)continue;let p=h+f,g=d+u;if(p<0||g<0||p>=t||g>=e)continue;let m=g*t+p;this.region[m]!==-1||this.speed[m]<=0||(this.region[m]=r,o.push(m))}}l>i&&(i=l,n=r),r++}this.mainRegion=n,this.mainSize=i}cellAt(t,e){let n=Math.max(0,Math.min(this.w-1,Math.floor(t/Te)));return Math.max(0,Math.min(this.h-1,Math.floor(e/Te)))*this.w+n}biomeAt(t,e){return this.biome[this.cellAt(t,e)]}speedAt(t,e){let n=this.cellAt(t,e);return this.speed[n]*(this.road[n]?1.25:1)}isMainland(t,e){return this.region[this.cellAt(t,e)]===this.mainRegion}nearestMainland(t,e){let n=this.cellAt(t,e);if(this.region[n]===this.mainRegion)return[t,e];let i=n%this.w,r=n/this.w|0;for(let o=1;o<80;o++)for(let a=-o;a<=o;a++)for(let l=-o;l<=o;l++){if(Math.max(Math.abs(l),Math.abs(a))!==o)continue;let c=i+l,h=r+a;if(!(c<0||h<0||c>=this.w||h>=this.h)&&this.region[h*this.w+c]===this.mainRegion)return[(c+.5)*Te,(h+.5)*Te]}return[t,e]}};var wh=class{constructor(){this.items=[],this.prio=[]}get size(){return this.items.length}push(t,e){let n=this.items,i=this.prio;n.push(t),i.push(e);let r=n.length-1;for(;r>0;){let o=r-1>>1;if(i[o]<=i[r])break;[n[o],n[r]]=[n[r],n[o]],[i[o],i[r]]=[i[r],i[o]],r=o}}pop(){let t=this.items,e=this.prio,n=t[0],i=t.pop(),r=e.pop();if(t.length){t[0]=i,e[0]=r;let o=0;for(;;){let a=o*2+1,l=a+1,c=o;if(a<t.length&&e[a]<e[c]&&(c=a),l<t.length&&e[l]<e[c]&&(c=l),c===o)break;[t[c],t[o]]=[t[o],t[c]],[e[c],e[o]]=[e[o],e[c]],o=c}}return n}},u0=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,Math.SQRT2],[1,-1,Math.SQRT2],[-1,1,Math.SQRT2],[-1,-1,Math.SQRT2]],wa=class{constructor(t){this.nav=t;let e=t.w*t.h;this.g=new Float32Array(e),this.from=new Int32Array(e),this.stamp=new Uint32Array(e),this.closed=new Uint32Array(e),this.run=0}cellSpeed(t){return this.nav.speed[t]*(this.nav.road[t]?1.25:1)}find(t,e,n,i,r=6e4){let o=this.nav,a=o.w,l=o.cellAt(t,e),c=o.cellAt(n,i);if(o.speed[c]<=0||o.region[c]!==o.region[l]){let M=this.nearestPassable(c,o.region[l]);if(M<0)return null;c=M,n=(c%a+.5)*Te,i=((c/a|0)+.5)*Te}if(o.speed[l]<=0){let M=this.nearestPassable(l,-1);if(M<0)return null;l=M}if(l===c)return[[n,i]];this.run++;let h=this.run,d=new wh,u=c%a,f=c/a|0,p=1.3,g=M=>{let v=Math.abs(M%a-u),S=Math.abs((M/a|0)-f);return(Math.max(v,S)+(Math.SQRT2-1)*Math.min(v,S))/p};this.g[l]=0,this.stamp[l]=h,this.from[l]=-1,d.push(l,g(l));let m=0,y=!1;for(;d.size;){let M=d.pop();if(this.closed[M]===h)continue;if(this.closed[M]=h,M===c){y=!0;break}if(++m>r)break;let v=M%a,S=M/a|0,T=this.g[M];for(let[C,_,A]of u0){let R=v+C,I=S+_;if(R<0||I<0||R>=a||I>=o.h)continue;let D=I*a+R,O=this.cellSpeed(D);if(O<=0||C&&_&&(o.speed[S*a+R]<=0||o.speed[I*a+v]<=0))continue;let N=T+A/Math.min(O,this.cellSpeed(M));(this.stamp[D]!==h||N<this.g[D])&&(this.stamp[D]=h,this.g[D]=N,this.from[D]=M,d.push(D,N+g(D)))}}if(!y)return null;let x=[];for(let M=c;M!==-1;M=this.from[M])x.push(M);return x.reverse(),this.smooth(x,n,i)}nearestPassable(t,e){let n=this.nav,i=n.w,r=t%i,o=t/i|0;for(let a=1;a<60;a++){let l=-1,c=1/0;for(let h=-a;h<=a;h++)for(let d=-a;d<=a;d++){if(Math.max(Math.abs(d),Math.abs(h))!==a)continue;let u=r+d,f=o+h;if(u<0||f<0||u>=i||f>=n.h)continue;let p=f*i+u;if(n.speed[p]<=0||e>=0&&n.region[p]!==e)continue;let g=d*d+h*h;g<c&&(c=g,l=p)}if(l>=0)return l}return-1}lineClear(t,e,n){let r=this.nav.w,o=t%r,a=t/r|0,l=e%r,c=e/r|0,h=Math.abs(l-o),d=-Math.abs(c-a),u=o<l?1:-1,f=a<c?1:-1,p=h+d;for(;;){let g=this.cellSpeed(a*r+o);if(g<=0||g<n-1e-6)return!1;if(o===l&&a===c)return!0;let m=2*p;m>=d&&(p+=d,o+=u),m<=h&&(p+=h,a+=f)}}smooth(t,e,n){let i=this.nav.w,r=[],o=0;for(;o<t.length-1;){let l=this.cellSpeed(t[o]),c=o+1,h=o+1;for(;c<t.length&&(l=Math.min(l,this.cellSpeed(t[c])),!(c-o>40));)this.lineClear(t[o],t[c],l)&&(h=c),c++;r.push(t[h]),o=h}let a=r.map(l=>[(l%i+.5)*Te,((l/i|0)+.5)*Te]);return a.length?a[a.length-1]=[e,n]:a.push([e,n]),a}markRoad(t,e,n,i){let r=this.find(t,e,n,i);if(!r)return null;let o=this.nav,a=[[t,e],...r];for(let l=0;l<a.length-1;l++){let[c,h]=a[l],[d,u]=a[l+1],f=Math.ceil(Math.hypot(d-c,u-h)/(Te*.5));for(let p=0;p<=f;p++){let g=p/Math.max(1,f),m=o.cellAt(c+(d-c)*g,h+(u-h)*g);o.speed[m]>0&&(o.road[m]=1)}}return a}};function f0(s){let t=s.eq.armor?wt[s.eq.armor[0]]:null,e=s.eq.helmet?wt[s.eq.helmet.find(n=>n)||""]:null;return(t?t.armor:0)+(e?e.armor*.3:0)}function gi(s,t=lt,e=60){let n=[[],[]];for(let h=0;h<2;h++){for(let d of s[h].stacks){let u=Gt[d.troopId];if(!u)continue;let f=f0(u);for(let p=0;p<d.count;p++)n[h].push({key:d.key,troopId:d.troopId,hp:u.hp,power:u.power,armor:f,hero:!1})}for(let d of s[h].heroes||[])n[h].push({key:d.key,hp:d.hp,power:d.power,armor:d.armor||10,hero:!0})}let i=[new Map,new Map],r=new Set,o=[n[0].slice(),n[1].slice()],a=(h,d,u)=>{if(d.hero){r.add(d.key);return}let f=i[h].get(d.key);f||(f={killed:{},wounded:{}},i[h].set(d.key,f));let p=u?f.killed:f.wounded;p[d.troopId]=(p[d.troopId]||0)+1},l=0;for(;o[0].length&&o[1].length&&l<e;){l++;for(let h=0;h<2;h++){let d=1-h,u=Math.max(1,Math.round(o[h].length*.35));for(let f=0;f<u&&o[d].length&&o[h].length;f++){let p=o[h][Math.floor(t.float()*o[h].length)],g=Math.floor(t.float()*o[d].length),m=o[d][g],y=p.power*(s[h].bonus||1)*t.range(.55,1.45),x=Math.max(1,y-m.armor*.25)*(1-Math.min(.5,m.armor*.006));if(m.hp-=x,m.hp<=0){o[d][g]=o[d][o[d].length-1],o[d].pop();let M=t.float()<(s[d].woundChance??.25);a(d,m,!M)}}}}let c;if(!o[0].length&&!o[1].length)c=1;else if(!o[1].length&&o[0].length)c=0;else if(!o[0].length&&o[1].length)c=1;else{let h=d=>d.reduce((u,f)=>u+f.power*Math.max(0,f.hp),0);c=h(o[0])>=h(o[1])?0:1}return{winner:c,losses:i,heroesDown:r,remaining:[o[0].length,o[1].length]}}function we(s,t,e,n=0){if(e<=0)return;let i=s.find(r=>r.id===t);i||(i={id:t,count:0,wounded:0,xp:0},s.push(i)),i.count+=e,i.wounded+=Math.min(n,e)}function Mn(s,t,e,n=!1){let i=s.find(l=>l.id===t);if(!i||e<=0)return 0;let r=Math.min(e,i.count),o=i.count-i.wounded,a;return n?a=Math.min(r,i.wounded):a=Math.max(0,r-o),i.wounded-=a,i.count-=r,i.count<=0?s.splice(s.indexOf(i),1):i.xp=Math.min(i.xp,i.count*Gt[i.id].upgradeXp),r}function p0(s,t,e){let n=s.find(i=>i.id===t);n&&(n.wounded=Math.min(n.count,n.wounded+e))}function de(s){let t=0;for(let e of s)t+=e.count;return t}function ke(s){let t=0;for(let e of s)t+=e.count-e.wounded;return t}function Vi(s){let t=0;for(let e of s)t+=e.wounded;return t}function nf(s){let t=0,e=0;for(let n of s){let i=n.count-n.wounded;e+=n.count,Gt[n.id].mounted&&(t+=i)}return e?t/e:0}function yi(s,t){if(t){for(let[e,n]of Object.entries(t.killed||{}))Mn(s,e,n,!1);for(let[e,n]of Object.entries(t.wounded||{}))p0(s,e,n)}}function ba(s){let t=0;for(let e of s)t+=Gt[e.id].power*(e.count-e.wounded);return t}function Sa(s){let t=0;for(let e of s)t+=Gt[e.id].wage*e.count;return t}function $s(s,t){let e=Gt[s.id];e.up.length&&(s.xp=Math.min(s.count*e.upgradeXp,s.xp+t))}function Xr(s){let t=Gt[s.id];return t.up.length?Math.min(s.count-s.wounded,Math.floor(s.xp/t.upgradeXp)):0}function bh(s,t,e,n){let i=Gt[t.id];if(n=Math.min(n,Xr(t)),n<=0)return 0;t.xp-=n*i.upgradeXp;let r=t.id;return Mn(s,r,n,!1),we(s,e,n),n}function Xs(s,t=4){let e=[...s].sort((i,r)=>r.count-i.count),n=e.slice(0,t).map(i=>`${Gt[i.id].name} \xD7${i.count}`);return e.length>t&&n.push("\u2026"),n.join(", ")}var xi=60;function qs(s,t){let e=s.find(n=>n.id===t);return e?e.qty:0}function An(s,t,e=1){let n=s.find(i=>i.id===t);return n||(n={id:t,qty:0},wt[t].type==="food"&&(n.left=wt[t].servings),s.push(n)),n.qty+=e,n}function Xn(s,t,e=1){let n=s.find(r=>r.id===t);if(!n)return 0;let i=Math.min(e,n.qty);return n.qty-=i,n.qty<=0&&s.splice(s.indexOf(n),1),i}function vi(s){let t=0;for(let e of s)t+=e.qty;return t}function Ys(s){let t=0;for(let e of s){let n=wt[e.id];n.type==="food"&&(t+=(e.qty-1)*n.servings+(e.left??n.servings))}return t}function sf(s,t){let e=t,n=0;for(;e>0&&n++<1e4;){let i=s.filter(r=>wt[r.id].type==="food"&&r.qty>0);if(!i.length)break;for(let r of i){if(e<=0)break;r.left==null&&(r.left=wt[r.id].servings),r.left-=1,e-=1,r.left<=0&&(r.qty-=1,r.left=wt[r.id].servings,r.qty<=0&&s.splice(s.indexOf(r),1))}}return Math.max(0,e)}function rf(s){let t=0;for(let e of s){let n=wt[e.id];n.type==="food"&&e.qty>0&&(t+=2+n.morale)}return t}function of(s,t){let e={};for(let i of ds)e[i]=s.range(.9,1.12);for(let i of Bi)e[i]=s.range(.9,1.15);let n=s.shuffle([...ds]);if(t.produces=[],t.demands=[],t.kind==="town")t.produces=n.slice(0,2),t.demands=n.slice(2,4);else if(t.kind==="village"){t.produces=[n[0]];for(let i of Bi)e[i]*=.75}for(let i of t.produces)e[i]=s.range(.55,.7);for(let i of t.demands)e[i]=s.range(1.35,1.6);t.market=e,t.marketBase={...e}}function af(s){if(s.market)for(let t of Object.keys(s.market)){let e=s.marketBase[t];s.market[t]+=(e-s.market[t])*.08}}function Sh(s,t,e){let n=wt[e],i=hn(s,"trade"),r=1;return(n.type==="good"||n.type==="food")&&(r=t.market?t.market[e]??1:1),Math.max(1,Math.round(n.price*r*(1.1-i*.012)))}function Th(s,t,e){let n=wt[e],i=hn(s,"trade");if(n.type==="good"||n.type==="food"){let r=t.market?t.market[e]??1:1;return Math.max(1,Math.round(n.price*r*(.88+i*.012)))}return n.type==="quest"?0:Math.max(1,Math.round(n.price*(.3+i*.025)))}function Eh(s,t,e){!s.market||s.market[t]==null||(s.market[t]*=e?1.035:.965,s.market[t]=Math.max(.35,Math.min(2.5,s.market[t])))}function Ah(s,t){let e=t.culture,n=new Map,i=(c,h)=>{!c||!Hs(c)||wt[c].training||n.set(c,(n.get(c)||0)+h)};for(let c of Mh[e]||[]){let h=Gt[c];for(let d of Object.values(h.eq))for(let u of d)i(u,3)}for(let c of Object.keys(wt))i(c,1);let r=[...n.entries()],o=new Set,a=t.kind==="town"?18:0,l=0;for(;o.size<a&&l++<500;)o.add(s.weighted(r));t.shop=[...o]}function lf(s,t){let e=Gt[t];return Math.round((15+e.tier*e.tier*12)*(1+hn(s,"trade")*.03))}var m0=["\u0411\u0430\u043D\u0434\u0430 \u0427\u043E\u0440\u043D\u043E\u0433\u043E \u0412\u043E\u0432\u043A\u0430","\u0417\u0433\u0440\u0430\u044F \u0420\u0443\u0434\u043E\u0433\u043E \u041A\u043D\u0443\u0440\u0430","\u0412\u0430\u0442\u0430\u0433\u0430 \u041A\u0440\u0438\u0432\u043E\u0433\u043E \u041D\u043E\u0436\u0430","\u0428\u0430\u0439\u043A\u0430 \u0421\u043B\u0456\u043F\u043E\u0433\u043E \u041C\u0438\u0440\u043E\u043D\u0430","\u0411\u0440\u0430\u0442\u0441\u0442\u0432\u043E \u0421\u0456\u0440\u043E\u0457 \u0421\u043E\u0432\u0438","\u0411\u0430\u043D\u0434\u0430 \u0417\u0430\u043B\u0456\u0437\u043D\u043E\u0433\u043E \u0417\u0443\u0431\u0430"];function Ch(s){let t=s.state;t.quests=t.quests.filter(n=>n.status!=="offered");let e=t.settlements.filter(n=>n.kind==="town");for(let n of e){if(!lt.chance(.75))continue;let i=lt.chance(.5)?"bounty":"delivery";if(i==="bounty"){let r=lt.pick(m0);t.quests.push({id:s.newId("q"),type:i,giver:n.id,status:"offered",title:`\u041F\u043E\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u043D\u0430 \xAB${r}\xBB`,gang:r,desc:`\u0411\u0430\u043D\u0434\u0430 \xAB${r}\xBB \u0433\u0440\u0430\u0431\u0443\u0454 \u043F\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u0456\u0445 \u0431\u0456\u043B\u044F \u043C\u0456\u0441\u0442\u0430 ${n.name}. \u0417\u043D\u0438\u0449\u0456\u0442\u044C \u0457\u0457 \u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C 10 \u0434\u043D\u0456\u0432.`,reward:lt.int(22,40)*10,xp:220,days:10})}else{let r=e.filter(c=>c!==n&&Ye(c.x,c.y,n.x,n.y)>350&&Ye(c.x,c.y,n.x,n.y)<1500);if(!r.length)continue;let o=lt.pick(r),a=Ye(o.x,o.y,n.x,n.y),l=Math.ceil(a/260)+3;t.quests.push({id:s.newId("q"),type:i,giver:n.id,target:o.id,status:"offered",title:`\u0412\u0430\u043D\u0442\u0430\u0436 \u0434\u043E ${o.name}`,desc:`\u041A\u0443\u043F\u0446\u0456 \u043C\u0456\u0441\u0442\u0430 ${n.name} \u043F\u0440\u043E\u0441\u044F\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043E\u043F\u0435\u0447\u0430\u0442\u0430\u043D\u0438\u0439 \u0432\u0430\u043D\u0442\u0430\u0436 \u0434\u043E \u043C\u0456\u0441\u0442\u0430 ${o.name} \u0437\u0430 ${l} \u0434\u043D\u0456\u0432.`,reward:Math.round((80+a*.28)/10)*10,xp:120,days:l})}}}function Rh(s,t){return s.state.quests.filter(e=>e.status==="offered"&&e.giver===t)}function cf(s,t){let e=s.state,n=s.sById.get(t.giver);if(s.isHostile(n.faction,"player"))return"\u0412\u043E\u0440\u043E\u0436\u0456 \u043C\u0456\u0441\u0442\u0430 \u043D\u0435 \u0434\u043E\u0432\u0456\u0440\u044F\u044E\u0442\u044C \u0432\u0430\u043C.";if(t.status="active",t.deadline=s.day+t.days,t.type==="bounty"){let i=s.spawnBandits(n);if(!i)return t.status="offered","\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u043D\u0430\u0439\u0442\u0438 \u0431\u0430\u043D\u0434\u0443.";i.name=t.gang,i.questId=t.id,i.troops=[],we(i.troops,"deserter",lt.int(3,6)),we(i.troops,"looter",lt.int(6,12)),we(i.troops,"forest_bandit",lt.int(2,5)),i.gold=lt.int(150,300),t.targetParty=i.id}else An(e.player.inventory,"cargo",1);return s.message(`\u041D\u043E\u0432\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F: ${t.title}.`,"good"),null}function hf(s,t){return s.state.quests.filter(e=>e.status==="active"&&e.type==="delivery"&&e.target===t)}function df(s,t){let e=s.state;if(qs(e.player.inventory,"cargo")<=0)return!1;Xn(e.player.inventory,"cargo",1),t.status="done",e.player.gold+=t.reward,s.addPlayerXp(t.xp);let n=s.sById.get(t.giver);return Ht[n.faction]&&s.changeRelation(n.faction,2),e.player.renown+=3,s.message(`\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043E: ${t.title}. \u041D\u0430\u0433\u043E\u0440\u043E\u0434\u0430 ${t.reward} \u0437\u043E\u043B\u043E\u0442\u0430.`,"good"),!0}function uf(s,t,e=!1){if(!t.questId)return;let n=s.state.quests.find(i=>i.id===t.questId);if(!(!n||n.status!=="active"))if(e){n.status="done",s.state.player.gold+=n.reward,s.addPlayerXp(n.xp);let i=s.sById.get(n.giver);Ht[i.faction]&&s.changeRelation(i.faction,3),s.state.player.renown+=5,s.message(`\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043E: ${n.title}. \u041D\u0430\u0433\u043E\u0440\u043E\u0434\u0430 ${n.reward} \u0437\u043E\u043B\u043E\u0442\u0430.`,"good")}else n.status="failed",s.message(`\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \xAB${n.title}\xBB \u043F\u0440\u043E\u0432\u0430\u043B\u0435\u043D\u043E: \u0431\u0430\u043D\u0434\u0443 \u0437\u043D\u0438\u0449\u0438\u0432 \u0445\u0442\u043E\u0441\u044C \u0456\u043D\u0448\u0438\u0439.`,"warn")}function ff(s){let t=s.state;for(let e of t.quests){if(e.status!=="active"||s.day<=e.deadline)continue;e.status="failed";let n=s.sById.get(e.giver);if(Ht[n.faction]&&s.changeRelation(n.faction,-3),e.type==="delivery"&&Xn(t.player.inventory,"cargo",1),e.type==="bounty"&&e.targetParty){let i=s.pById.get(e.targetParty);i&&(i.questId=null)}s.message(`\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \xAB${e.title}\xBB \u043F\u0440\u043E\u0432\u0430\u043B\u0435\u043D\u043E \u2014 \u043C\u0438\u043D\u0443\u0432 \u0442\u0435\u0440\u043C\u0456\u043D.`,"danger")}t.quests.length>60&&(t.quests=t.quests.filter(e=>e.status==="offered"||e.status==="active"))}var g0=34,ps=170,Ta=10,Ea=18,Ke=(s,t)=>s<t?`${s}|${t}`:`${t}|${s}`;function Ph(s,t,e,n=.9){let i=s.cellAt(t,e),r=i%s.w,o=i/s.w|0;for(let a=0;a<120;a++)for(let l=-a;l<=a;l++)for(let c=-a;c<=a;c++){if(Math.max(Math.abs(c),Math.abs(l))!==a)continue;let h=r+c,d=o+l;if(h<2||d<2||h>=s.w-2||d>=s.h-2)continue;let u=d*s.w+h;if(s.region[u]===s.mainRegion&&!(s.speed[u]<n||s.biome[u]===ae.BEACH))return[(h+.5)*Te,(d+.5)*Te]}return s.nearestMainland(t,e)}function pf(s,t,e,n=5){let i=[];for(let r=0;r<e;r++)we(i,Ma(s,t,n),1);return i}function y0(s,t,e){let n=[],i={},r=(d,u,f=.7)=>{let p=t.cellAt(d,u);return t.region[p]===t.mainRegion&&t.speed[p]>=f&&t.biome[p]!==ae.BEACH},o=(d,u,f)=>n.some(p=>_e(p.x,p.y,d,u)<f*f);for(let d of Re){let[u,f]=Ht[d].anchor;i[d]=Ph(t,u*Tn,f*En)}let a=(d,u)=>{let f=null,p=1/0;for(let g of Re){let m=_e(i[g][0],i[g][1],d,u);m<p&&(p=m,f=g)}return f},l=[];for(let d=0;d<9e3;d++){let u=e.range(80,Tn-80),f=e.range(80,En-80);r(u,f)&&l.push({x:u,y:f,f:a(u,f)})}let c=0,h=(d,u,f,p,g)=>{let m={id:`s${c++}`,name:f,kind:u,faction:d,culture:d,owner:null,x:p,y:g,boundTo:null,garrison:[],prosperity:e.int(40,70),siege:null,volunteers:e.int(2,6),shop:[],tavern:null,visited:!1};return of(e,m),n.push(m),m};for(let d of Re)h(d,"town",Ht[d].towns[0],i[d][0],i[d][1]).capital=!0;for(let d of Re){let u=i[d][0],f=i[d][1],p=[["town",Ht[d].towns[1]],["castle",Ht[d].castles[0]],["town",Ht[d].towns[2]],["castle",Ht[d].castles[1]]];for(let[g,m]of p){let y=!1;for(let x=0;x<4&&!y;x++){let M=200-x*35,v=e.shuffle(l.filter(S=>S.f===d));for(let S of v){let T=Ye(S.x,S.y,u,f);if(!(T<180-x*30||T>720+x*150)&&!o(S.x,S.y,M)){h(d,g,m,S.x,S.y),y=!0;break}}}if(!y){let[x,M]=Ph(t,u+e.range(-250,250),f+e.range(-250,250));h(d,g,m,x,M)}}}for(let d of Re){let u=n.filter(p=>p.faction===d&&p.kind!=="village"),f=Ht[d].villages;for(let p=0;p<f.length;p++){let g=u[p%u.length],m=!1;for(let y=0;y<400&&!m;y++){let x=e.range(0,Math.PI*2),M=e.range(70,210+y*.4),v=g.x+Math.cos(x)*M,S=g.y+Math.sin(x)*M;v<60||S<60||v>Tn-60||S>En-60||r(v,S,.6)&&(o(v,S,y>250?60:85)||(h(d,"village",f[p],v,S).boundTo=g.id,m=!0))}if(!m){let[y,x]=Ph(t,g.x+90,g.y+60,.6);h(d,"village",f[p],y,x).boundTo=g.id}}}s.settlements=n}function x0(s,t){let e=Gs[t],n={...Ku};for(let[o,a]of Object.entries(e.attrs))n[o]+=a;let i={};for(let o of Object.keys(zi))i[o]=0;for(let[o,a]of Object.entries(e.skills))i[o]=a;let r={name:s||"\u041C\u0430\u043D\u0434\u0440\u0456\u0432\u043D\u0438\u043A",background:t,level:1,xp:0,attrs:n,skills:i,attrPoints:0,skillPoints:1,gold:e.gold,renown:0,equipment:{...e.equipment},inventory:[],kills:0,battlesWon:0};r.hp=Wn(r);for(let[o,a]of e.inventory)An(r.inventory,o,a);return r}function mf(s,t){s.companions={};let e=s.settlements.filter(n=>n.kind==="town");for(let[n,i]of Object.entries(ri))s.companions[n]={hired:!1,location:t.pick(e).id,hp:i.hp}}function Ih({seed:s=Math.random()*1e9|0,name:t,background:e="knight"}={}){let n=new Hr(s),i=new Wr(s),r=new $r(i),o={version:1,seed:s,time:8,nextId:1,player:x0(t,e),party:{id:"player",kind:"player",faction:"player",x:0,y:0,troops:[],prisoners:[],moraleBoost:10,path:null,target:null,graceUntil:0},factions:{},wars:{},warSince:{},settlements:[],lords:[],parties:[],battles:[],quests:[],contract:null,log:[],stats:{battles:0,won:0,killed:0}};for(let d of Re)o.factions[d]={id:d,relation:0};y0(o,r,n);let a=0;for(let d of Re){let u=Ht[d],f=o.settlements.filter(x=>x.faction===d&&x.kind!=="village"),p=f.find(x=>x.capital);[u.king,...u.lords].forEach((x,M)=>{let v={id:`l${a++}`,name:x,faction:d,king:M===0,partyId:null,respawnAt:0,homeId:p.id,relation:0};o.lords.push(v)});let m=o.lords.filter(x=>x.faction===d);p.owner=m[0].id,f.filter(x=>x!==p).forEach((x,M)=>{let v=m[1+M%(m.length-1)];x.owner=v.id,v.homeId=x.id})}for(let d of o.settlements)d.kind==="village"?d.owner=o.settlements.find(u=>u.id===d.boundTo).owner:(d.garrison=pf(n,d.faction,d.kind==="town"?n.int(45,65):n.int(25,40),4),Ah(n,d));let l=[];for(let d=0;d<Re.length;d++)for(let u=d+1;u<Re.length;u++)l.push([Re[d],Re[u]]);n.shuffle(l);for(let[d,u]of l.slice(0,2))o.wars[Ke(d,u)]=!0,o.warSince[Ke(d,u)]=0;let c=o.settlements.filter(d=>d.kind==="town"),h=n.pick(c);o.party.x=h.x+26,o.party.y=h.y-4,o.startTown=h.id;for(let[d,u]of Gs[e].troops)we(o.party.troops,d,u);return mf(o,n),o}var Zs=class{constructor(t){this.state=t,this.gen=new Wr(t.seed),this.nav=new $r(this.gen),this.pf=new wa(this.nav),this.listeners={},this.roads=[];for(let e of t.parties)e.held=!1;for(let e of t.battles)e.playerJoined=!1;t.party.resting=!1,this.index(),this.buildRoads(),t.companions||mf(t,lt),t.initialized||this.populate()}index(){let t=this.state;this.sById=new Map(t.settlements.map(e=>[e.id,e])),this.lById=new Map(t.lords.map(e=>[e.id,e])),this.pById=new Map(t.parties.map(e=>[e.id,e]))}on(t,e){var n;((n=this.listeners)[t]||(n[t]=[])).push(e)}emit(t,e){for(let n of this.listeners[t]||[])n(e)}newId(t){return`${t}${this.state.nextId++}`}message(t,e="info"){let n=this.state;n.log.push({t:n.time,text:t,kind:e}),n.log.length>200&&n.log.splice(0,n.log.length-200),this.emit("message",{text:t,kind:e})}buildRoads(){let t=this.state,e=t.settlements.filter(r=>r.kind!=="village"),n=new Set,i=(r,o)=>{let a=r.id<o.id?`${r.id}-${o.id}`:`${o.id}-${r.id}`;if(n.has(a))return;n.add(a);let l=this.pf.markRoad(r.x,r.y,o.x,o.y);l&&this.roads.push(l)};for(let r of e){let o=e.filter(a=>a!==r).sort((a,l)=>_e(a.x,a.y,r.x,r.y)-_e(l.x,l.y,r.x,r.y)).slice(0,2);for(let a of o)Ye(a.x,a.y,r.x,r.y)<900&&i(r,a)}for(let r of t.settlements.filter(o=>o.kind==="village"))i(r,this.sById.get(r.boundTo))}populate(){let t=this.state;t.initialized=!0;for(let e of t.lords)this.spawnLordParty(e,e.king?lt.int(80,110):lt.int(35,70));for(let e=0;e<13;e++)this.spawnBandits();for(let e of Re)for(let n=0;n<2;n++)this.spawnCaravan(e);Ch(this)}get time(){return this.state.time}get day(){return Math.floor(this.state.time/24)+1}isNight(){let t=this.state.time%24;return t<5||t>=21}atWar(t,e){return!!this.state.wars[Ke(t,e)]}playerSide(){return this.state.contract?this.state.contract.faction:"player"}isHostile(t,e){if(t===e)return!1;if(t==="bandits"||e==="bandits")return!0;let n=this.state;if(t==="player"||e==="player"){let i=t==="player"?e:t;if(n.contract){if(i===n.contract.faction)return!1;if(this.atWar(n.contract.faction,i))return!0}return n.factions[i].relation<=-10||!!n.wars[Ke("player",i)]}return n.contract&&(t===n.contract.faction||e===n.contract.faction)&&(t===n.contract.faction?e:t)==="player"?!1:this.atWar(t,e)}partyFaction(t){return t.id==="player"?"player":t.faction}heroPower(){let t=this.state.player,e=t.equipment,n=0;for(let r of["w1","w2","w3"]){let o=wt[e[r]];o&&(n=Math.max(n,o.slot==="ranged"?o.dmg:Math.max(o.swing?o.swing[0]:0,o.thrust?o.thrust[0]:0)))}let i=(wt[e.armor]?.armor||0)+(wt[e.helmet]?.armor||0)*.4;return 10+t.level*1.5+n*.6+i*.25+(e.horse?6:0)}strength(t){if(t.id==="player"){let e=ba(t.troops)+this.heroPower()*(this.state.player.hp>15?1:.3);for(let n of $n(this.state))e+=(10+n.def.level*2)*(n.st.hp>15?1:.3);return e}return ba(t.troops)+(t.lordId?25:0)}garrisonStrength(t){let e=ba(t.garrison);for(let n of this.state.parties)n.inside===t.id&&!this.isHostile(n.faction,t.faction)&&(e+=this.strength(n));return e}partySpeed(t){let e=this.state,n=t.id==="player",i=n?$n(e):[],r=de(t.troops)+(n?1+i.length:0),o=nf(t.troops);if(n){let c=de(t.troops),h=(e.player.equipment.horse?1:0)+i.filter(d=>d.def.equipment.horse).length;o=(o*c+h)/(c+1+i.length)}let a=r?Vi(t.troops)/r:0,l=g0*(1-Math.min(.35,r/260))*(1+.32*o)*(1-.3*a);return n&&(l*=1+hn(e,"pathfinding")*.03),t.kind==="caravan"&&(l*=.82),t.kind==="bandit"&&(l*=1.02),t.ai?.mode==="flee"&&(l*=1.05),this.isNight()&&(l*=.85),l}addParty(t){return this.state.parties.push(t),this.pById.set(t.id,t),t}removeParty(t,e=!1){let n=this.state;if(!this.pById.has(t.id))return;let i=n.parties.indexOf(t);if(i>=0&&n.parties.splice(i,1),this.pById.delete(t.id),t.lordId){let r=this.lById.get(t.lordId);r&&(r.partyId=null,r.respawnAt=n.time+lt.range(48,110))}for(let r of n.settlements)r.siege&&(r.siege.parties=r.siege.parties.filter(o=>o!==t.id));uf(this,t,e)}spawnLordParty(t,e){let n=this.state,i=this.sById.get(t.homeId),r=i&&i.faction===t.faction?i:n.settlements.find(a=>a.faction===t.faction&&a.kind!=="village");if(!r)return null;t.homeId=r.id;let o=this.addParty({id:this.newId("p"),kind:"lord",faction:t.faction,name:`\u0417\u0430\u0433\u0456\u043D: ${t.name}`,lordId:t.id,x:r.x+lt.range(-8,8),y:r.y+lt.range(-8,8),troops:pf(lt,t.faction,e),prisoners:[],gold:lt.int(300,1200),ai:{mode:"rest",thinkAt:n.time+lt.range(0,6),until:n.time+lt.range(2,12),path:null,pi:0},inside:r.id});return t.partyId=o.id,o}spawnBandits(t){let e=this.state,n,i,r=!1;for(let d=0;d<200&&!r;d++){if(t?(n=t.x+lt.range(-220,220),i=t.y+lt.range(-220,220)):(n=lt.range(100,Tn-100),i=lt.range(100,En-100)),!this.nav.isMainland(n,i)||this.nav.speedAt(n,i)<=0)continue;let u=t?70:170;e.settlements.some(f=>_e(f.x,f.y,n,i)<u*u)||_e(e.party.x,e.party.y,n,i)<4e4||(r=!0)}if(!r)return null;let o=this.nav.biomeAt(n,i),a,l;o===ae.STEPPE||o===ae.DESERT?[a,l]=["steppe_bandit","\u0421\u0442\u0435\u043F\u043E\u0432\u0456 \u0433\u0440\u0430\u0431\u0456\u0436\u043D\u0438\u043A\u0438"]:o===ae.FOREST||o===ae.TAIGA?[a,l]=["forest_bandit","\u041B\u0456\u0441\u043E\u0432\u0456 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438"]:o===ae.MOUNTAIN||o===ae.SNOW?[a,l]=["mountain_bandit","\u0413\u0456\u0440\u0441\u044C\u043A\u0456 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438"]:lt.chance(.25)?[a,l]=["sea_raider","\u041C\u043E\u0440\u0441\u044C\u043A\u0456 \u0440\u0435\u0439\u0434\u0435\u0440\u0438"]:lt.chance(.2)?[a,l]=["deserter","\u0414\u0435\u0437\u0435\u0440\u0442\u0438\u0440\u0438"]:[a,l]=["looter","\u041C\u0430\u0440\u043E\u0434\u0435\u0440\u0438"];let c=[],h=a==="looter"?lt.int(6,22):lt.int(5,18);return we(c,a,h),a!=="looter"&&lt.chance(.5)&&we(c,"looter",lt.int(2,8)),this.addParty({id:this.newId("p"),kind:"bandit",faction:"bandits",name:l,x:n,y:i,troops:c,prisoners:[],gold:lt.int(40,220),ai:{mode:"roam",thinkAt:e.time,path:null,pi:0,homeX:n,homeY:i},inside:null})}spawnCaravan(t){let e=this.state,n=e.settlements.filter(a=>a.kind==="town"&&a.faction===t);if(!n.length)return null;let i=lt.pick(n),r=[];we(r,"caravan_guard",lt.int(8,18)),we(r,"watchman",lt.int(4,10));let o=[];for(let a=0;a<3;a++)o.push({id:lt.pick(ds),qty:lt.int(2,5)});return this.addParty({id:this.newId("p"),kind:"caravan",faction:t,name:`\u041A\u0430\u0440\u0430\u0432\u0430\u043D (${Ht[t].short})`,x:i.x+6,y:i.y+6,troops:r,prisoners:[],gold:lt.int(300,900),goods:o,ai:{mode:"rest",thinkAt:e.time+lt.range(0,4),until:e.time+lt.range(0,6),path:null,pi:0},inside:i.id})}setPath(t,e,n){let i=this.pf.find(t.x,t.y,e,n);return t.id==="player"?(t.path=i,t.pi=0):(t.ai.path=i,t.ai.pi=0),!!i}stepAlong(t,e,n){let i=e.path;if(!i||e.pi>=i.length)return!0;let r=Math.max(.35,this.nav.speedAt(t.x,t.y)),o=this.partySpeed(t)*r*n;for(;o>0&&e.pi<i.length;){let[a,l]=i[e.pi],c=a-t.x,h=l-t.y,d=Math.hypot(c,h);d<=o?(t.x=a,t.y=l,o-=d,e.pi++):(t.x+=c/d*o,t.y+=h/d*o,o=0)}return e.pi>=i.length}orderPlayerMove(t,e){let n=this.state.party;return n.target={type:"point",x:t,y:e},this.setPath(n,t,e)}orderPlayerTarget(t,e){let n=this.state.party,i=t==="settlement"?this.sById.get(e):t==="battle"?this.state.battles.find(r=>r.id===e):this.pById.get(e);return i?(n.target={type:t,id:e},n.repathAt=this.state.time+.4,this.setPath(n,i.x,i.y)):!1}stopPlayer(){let t=this.state.party;t.path=null,t.target=null}playerMoving(){let t=this.state.party;return!!(t.path&&t.pi<t.path.length)}advance(t){let e=t;for(;e>1e-6;){let n=Math.min(.2,e);e-=n;let i=this.tick(n);if(i)return i}return null}skipTime(t){let e=this.state;this.stopPlayer(),e.party.graceUntil=Math.max(e.party.graceUntil,e.time+t+2),this.skipping=!0;try{let n=t;for(;n>1e-6;){let i=Math.min(.25,n);n-=i,this.tick(i)}}finally{this.skipping=!1}}tick(t){let e=this.state,n=e.time;e.time+=t,Math.floor(e.time)!==Math.floor(n)&&this.hourly(Math.floor(e.time));for(let r of[...e.parties])this.pById.has(r.id)&&(r.battleId||r.held||(e.time>=r.ai.thinkAt&&this.think(r),!r.inside&&r.ai.path&&this.stepAlong(r,r.ai,t)&&this.onArrive(r)));this.checkAiEncounters(),this.updateBattles();let i=e.party;if(i.path){if(i.target&&i.target.type==="party"&&e.time>=(i.repathAt||0)){let r=this.pById.get(i.target.id);r?(i.repathAt=e.time+.4,this.setPath(i,r.x,r.y)):this.stopPlayer()}if(i.path&&this.stepAlong(i,i,t)){i.path=null;let o=i.target;if(o?.type==="settlement")return i.target=null,{type:"settlement",id:o.id};if(o?.type==="battle")return i.target=null,{type:"battleSite",id:o.id};o?.type==="point"&&(i.target=null)}}return this.checkPlayerEncounters()}checkPlayerEncounters(){let t=this.state,e=t.party;if(e.target?.type==="party"){let n=this.pById.get(e.target.id);if(n&&!n.inside&&_e(n.x,n.y,e.x,e.y)<Ta*Ta)return this.stopPlayer(),n.battleId?{type:"battleSite",id:n.battleId}:{type:"encounter",id:n.id,initiator:"player"}}if(t.time<e.graceUntil)return null;for(let n of t.parties)if(!(n.inside||n.battleId||n.kind==="caravan")&&this.isHostile(n.faction,"player")&&n.ai.mode!=="flee"&&_e(n.x,n.y,e.x,e.y)<Ta*Ta*.8){if(this.strength(n)<this.strength(e)*.6&&n.ai.mode!=="hunt")continue;return this.stopPlayer(),{type:"encounter",id:n.id,initiator:"ai"}}return null}visibleHostiles(t){let e=this.state,n=this.isNight()?ps*.65:ps,i=[];for(let o of e.parties)o===t||o.inside||o.battleId||this.isHostile(t.faction,o.faction)&&_e(o.x,o.y,t.x,t.y)<n*n&&i.push(o);let r=e.party;return t.faction!=="player"&&this.isHostile(t.faction,"player")&&e.time>=r.graceUntil&&_e(r.x,r.y,t.x,t.y)<n*n&&i.push(r),i}think(t){let e=this.state;t.ai.thinkAt=e.time+lt.range(.4,.9);let n=this.strength(t);if(t.ai.mode==="siege"&&t.ai.besieging){let a=this.sById.get(t.ai.besieging);if(a&&a.siege&&a.siege.parties.includes(t.id)&&this.isHostile(t.faction,a.faction)&&!this.visibleHostiles(t).find(c=>this.strength(c)>n*1.4&&Ye(c.x,c.y,t.x,t.y)<80))return;t.ai.besieging=null,t.ai.mode="patrol"}if(t.inside){if(e.time<(t.ai.until||0))return;if(t.kind==="lord"&&ke(t.troops)<25){t.ai.until=e.time+12;return}t.inside=null,t.ai.mode="idle"}if(t.fleeUntil&&e.time<t.fleeUntil){(!t.ai.path||t.ai.pi>=t.ai.path.length)&&this.flee(t,t.fledFrom==="player"?e.party:t),t.ai.mode="flee";return}let i=this.visibleHostiles(t),r=null,o=0;for(let a of i){let l=this.strength(a);l>o&&Ye(a.x,a.y,t.x,t.y)<ps*.7&&(r=a,o=l)}if(r&&o>n*1.25){this.flee(t,r);return}if(t.kind!=="caravan"){let a=null,l=1/0;for(let c of i){if(this.strength(c)>n*(t.kind==="bandit"?.8:.95)||t.kind==="bandit"&&c.kind==="lord")continue;let d=_e(c.x,c.y,t.x,t.y);d<l&&(l=d,a=c)}if(a){t.ai.mode="hunt",t.ai.target=a.id,this.setPath(t,a.x,a.y);return}}(t.ai.mode==="hunt"||t.ai.mode==="flee")&&(t.ai.mode="idle",t.ai.path=null),!(t.ai.path&&t.ai.pi<t.ai.path.length)&&(t.kind==="lord"?this.thinkLord(t,n):t.kind==="bandit"?this.thinkBandit(t):t.kind==="caravan"&&this.thinkCaravan(t))}flee(t,e){let n=t.x-e.x,i=t.y-e.y,r=Math.hypot(n,i)||1,o=null;for(let a=0;a<8;a++){let l=Math.atan2(i,n)+(a%2?1:-1)*Math.ceil(a/2)*.4,c=t.x+Math.cos(l)*160,h=t.y+Math.sin(l)*160;if(!(c<20||h<20||c>Tn-20||h>En-20)&&this.nav.speedAt(c,h)>0&&this.nav.isMainland(c,h)){o=[c,h];break}}if(t.kind!=="bandit"){let a=this.state.settlements.filter(l=>l.kind!=="village"&&l.faction===t.faction&&!l.siege).sort((l,c)=>_e(l.x,l.y,t.x,t.y)-_e(c.x,c.y,t.x,t.y))[0];if(a&&Ye(a.x,a.y,t.x,t.y)<150){let l=Math.atan2(a.y-t.y,a.x-t.x),c=Math.atan2(i,n);Math.abs((l-c+Math.PI*3)%(Math.PI*2)-Math.PI)<1.6&&(o=[a.x,a.y],t.ai.destId=a.id)}}t.ai.mode="flee",o&&this.setPath(t,o[0],o[1])}thinkLord(t,e){let n=this.state,i=this.lById.get(t.lordId),r=ke(t.troops),o=n.settlements.filter(u=>u.faction===t.faction&&u.kind!=="village");if(!o.length)return;if(r<22){let u=this.sById.get(i.homeId),f=u&&u.faction===t.faction&&!u.siege?u:o.sort((p,g)=>_e(p.x,p.y,t.x,t.y)-_e(g.x,g.y,t.x,t.y))[0];t.ai.mode="return",t.ai.destId=f.id,this.setPath(t,f.x,f.y);return}let a=o.filter(u=>u.siege).sort((u,f)=>_e(u.x,u.y,t.x,t.y)-_e(f.x,f.y,t.x,t.y))[0];if(a&&Ye(a.x,a.y,t.x,t.y)<900&&lt.chance(.7)){t.ai.mode="defend",t.ai.destId=a.id,this.setPath(t,a.x+lt.range(-20,20),a.y+lt.range(-20,20));return}let l=Re.filter(u=>u!==t.faction&&this.atWar(t.faction,u)),c=!!n.wars[Ke("player",t.faction)];if((l.length||c)&&r>=45&&lt.chance(.35)){let u=n.settlements.filter(f=>f.kind!=="village"&&this.isHostile(t.faction,f.faction)&&f.faction!=="bandits").filter(f=>Ye(f.x,f.y,t.x,t.y)<1e3).filter(f=>this.garrisonStrength(f)*1.5<e).sort((f,p)=>_e(f.x,f.y,t.x,t.y)-_e(p.x,p.y,t.x,t.y));if(u.length){let f=u[0];t.ai.mode="siege",t.ai.destId=f.id,this.setPath(t,f.x+lt.range(-10,10),f.y+lt.range(-10,10));return}}let h=n.settlements.filter(u=>u.faction===t.faction&&Ye(u.x,u.y,t.x,t.y)<700),d=h.length?lt.pick(h):lt.pick(o);t.ai.mode="patrol",t.ai.destId=d.id,this.setPath(t,d.x+lt.range(-25,25),d.y+lt.range(-25,25))}thinkBandit(t){for(let e=0;e<10;e++){let n=t.ai.homeX+lt.range(-260,260),i=t.ai.homeY+lt.range(-260,260);if(this.nav.isMainland(n,i)&&this.nav.speedAt(n,i)>0){t.ai.mode="roam",this.setPath(t,n,i);return}}}thinkCaravan(t){let n=this.state.settlements.filter(o=>o.kind==="town"&&!this.isHostile(o.faction,t.faction)&&o.id!==t.ai.destId&&!o.siege);if(!n.length)return;let i=n.sort((o,a)=>_e(o.x,o.y,t.x,t.y)-_e(a.x,a.y,t.x,t.y)).slice(0,4),r=lt.pick(i);t.ai.mode="travel",t.ai.destId=r.id,this.setPath(t,r.x,r.y)}onArrive(t){let e=this.state;t.ai.path=null;let n=t.ai.destId?this.sById.get(t.ai.destId):null;if(t.ai.mode==="siege"&&n){if(!this.isHostile(t.faction,n.faction)){t.ai.mode="idle";return}if(Ye(n.x,n.y,t.x,t.y)>30)return;if(n.siege&&n.siege.faction!==t.faction){t.ai.mode="idle";return}t.ai.besieging=n.id,n.siege?!n.siege.parties.includes(t.id)&&n.siege.faction===t.faction&&n.siege.parties.push(t.id):(n.siege={faction:t.faction,parties:[t.id],start:e.time},n.owner==="player"?this.message(`${t.name} \u0431\u0435\u0440\u0435 \u0432 \u043E\u0431\u043B\u043E\u0433\u0443 \u0432\u0430\u0448\u0435 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F ${n.name}!`,"danger"):this.isVisibleToPlayer(n)&&this.message(`${t.name} \u0431\u0435\u0440\u0435 \u0432 \u043E\u0431\u043B\u043E\u0433\u0443 ${n.name}.`,"war"));return}if(n&&(t.ai.mode==="return"||t.ai.mode==="travel"||t.ai.mode==="flee"||t.ai.mode==="patrol"&&n.kind!=="village")&&!this.isHostile(t.faction,n.faction)&&Ye(n.x,n.y,t.x,t.y)<30){if(t.inside=n.id,t.x=n.x,t.y=n.y,t.ai.until=e.time+(t.ai.mode==="return"?24:lt.range(3,10)),t.ai.mode="rest",t.kind==="caravan"&&n.market){t.gold+=lt.int(50,200);for(let i of t.goods)n.market[i.id]=Math.max(.35,(n.market[i.id]||1)*.97)}return}t.ai.mode="idle"}isVisibleToPlayer(t){let e=this.state.party;return Ye(t.x,t.y,e.x,e.y)<ps*1.5}checkAiEncounters(){let e=this.state.parties;for(let n=0;n<e.length;n++){let i=e[n];if(!(i.inside||i.battleId||i.held))for(let r=n+1;r<e.length;r++){let o=e[r];if(!(o.inside||o.battleId||o.held)&&!(_e(i.x,i.y,o.x,o.y)>81)&&this.isHostile(i.faction,o.faction)&&!(i.ai.mode==="flee"&&o.ai.mode==="flee")){this.startAiBattle(i,o);break}}}}startAiBattle(t,e){let n=this.state,i={id:this.newId("b"),x:(t.x+e.x)/2,y:(t.y+e.y)/2,sides:[[t.id],[e.id]],endsAt:n.time+lt.range(1.5,3.5)};for(let r of n.parties){if(r===t||r===e||r.inside||r.battleId||r.held||_e(r.x,r.y,i.x,i.y)>1600)continue;let o=!this.isHostile(r.faction,t.faction)&&this.isHostile(r.faction,e.faction),a=!this.isHostile(r.faction,e.faction)&&this.isHostile(r.faction,t.faction);if(o)i.sides[0].push(r.id);else if(a)i.sides[1].push(r.id);else continue;r.battleId=i.id}t.battleId=i.id,e.battleId=i.id,n.battles.push(i),this.isVisibleToPlayer(i)&&this.message(`\u0411\u0456\u0439: ${t.name} \u043F\u0440\u043E\u0442\u0438 ${e.name}.`,"war")}updateBattles(){let t=this.state;for(let e of[...t.battles])if(!e.playerJoined){if(e.sides=e.sides.map(n=>n.filter(i=>this.pById.has(i))),!e.sides[0].length||!e.sides[1].length){this.endBattle(e);continue}t.time>=e.endsAt&&this.resolveAiBattle(e)}}endBattle(t){let e=this.state;for(let i of t.sides)for(let r of i){let o=this.pById.get(r);o&&(o.battleId=null)}let n=e.battles.indexOf(t);n>=0&&e.battles.splice(n,1)}resolveAiBattle(t){let e=t.sides.map(i=>i.map(r=>this.pById.get(r)).filter(Boolean));if(e.some(i=>i.every(r=>ke(r.troops)===0))){for(let i of e)for(let r of i)ke(r.troops)===0&&r.kind!=="lord"&&this.removeParty(r);this.endBattle(t);return}let n=gi(e.map(i=>({stacks:i.flatMap(r=>r.troops.map(o=>({key:r.id,troopId:o.id,count:o.count-o.wounded}))),heroes:[],bonus:1,woundChance:.3})));this.applyAutoResult(t,e,n)}applyAutoResult(t,e,n){let i=n.winner;for(let c=0;c<2;c++)for(let h of e[c]){let d=n.losses[c].get(h.id);d&&yi(h.troops,d)}let r=e[i],o=e[1-i],a=0,l=o.map(c=>c.name).join(", ");for(let c of o)if(a+=Math.round((c.gold||0)*.6),ke(c.troops)<=3||c.kind!=="lord"||lt.chance(.6)){let h=r[0];if(h)for(let d of c.troops)d.wounded&&we(h.prisoners,d.id,Math.ceil(d.wounded*.5));c.lordId&&this.isVisibleToPlayer(c)&&this.message(`${this.lById.get(c.lordId).name} \u0440\u043E\u0437\u0431\u0438\u0442\u0438\u0439 \u0456 \u0432\u0442\u0456\u043A \u0437 \u043F\u043E\u043B\u044F \u0431\u043E\u044E.`,"war"),this.removeParty(c)}else this.flee(c,r[0]||c),c.fleeUntil=this.state.time+6;for(let c of r)c.gold=(c.gold||0)+Math.round(a/Math.max(1,r.length));this.isVisibleToPlayer(t)&&this.message(`${r.map(c=>c.name).join(", ")} \u043F\u0435\u0440\u0435\u043C\u0430\u0433\u0430\u0454 (${l}).`,"war"),this.endBattle(t)}hourly(t){let e=this.state,n=e.player,i=Wn(n);n.hp<i&&(n.hp=Math.min(i,n.hp+i*(e.party.resting?.045:.012)));for(let r of $n(e))r.st.hp<r.def.hp&&(r.st.hp=Math.min(r.def.hp,r.st.hp+r.def.hp*(e.party.resting?.045:.015)));this.updateSieges(),t%24===0&&this.daily()}daily(){let t=this.state,e=this.day,n=t.player,i=t.party,r=de(i.troops)+Math.ceil(de(i.prisoners)/2)+1+this.companionCount(),o=Math.ceil(r/3);sf(n.inventory,o)>0?(i.moraleBoost-=12,this.message("\u0412\u0430\u0448 \u0437\u0430\u0433\u0456\u043D \u0433\u043E\u043B\u043E\u0434\u0443\u0454! \u041A\u0443\u043F\u0456\u0442\u044C \u043F\u0440\u043E\u0432\u0456\u0437\u0456\u044E.","danger")):Ys(n.inventory)<o*2&&this.message("\u041F\u0440\u043E\u0432\u0456\u0437\u0456\u044F \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0454\u0442\u044C\u0441\u044F.","warn"),i.moraleBoost*=.85;for(let h of i.troops){if(h.wounded){let u=Math.max(lt.chance(.6)?1:0,Math.floor(h.wounded*(.18+hn(t,"surgery")*.04)));h.wounded=Math.max(0,h.wounded-u)}let d=hn(t,"trainer");d&&Gt[h.id].tier<=n.level/3+2&&$s(h,h.count*d*2)}if(this.playerMorale()<20&&de(i.troops)>0){let h=lt.pick(i.troops),d=Math.max(1,Math.round(h.count*.15));Mn(i.troops,h.id,d),this.message(`${d} ${Fi(d,"\u0432\u043E\u0457\u043D \u0434\u0435\u0437\u0435\u0440\u0442\u0438\u0440\u0443\u0432\u0430\u0432","\u0432\u043E\u0457\u043D\u0438 \u0434\u0435\u0437\u0435\u0440\u0442\u0438\u0440\u0443\u0432\u0430\u043B\u0438","\u0432\u043E\u0457\u043D\u0456\u0432 \u0434\u0435\u0437\u0435\u0440\u0442\u0438\u0440\u0443\u0432\u0430\u043B\u0438")} \u0447\u0435\u0440\u0435\u0437 \u043D\u0438\u0437\u044C\u043A\u0438\u0439 \u0431\u043E\u0439\u043E\u0432\u0438\u0439 \u0434\u0443\u0445.`,"danger")}for(let h of t.settlements)if(af(h),h.kind==="village"&&(h.volunteers=Math.min(8,h.volunteers+(lt.chance(.5)?1:0))),h.kind!=="village"){for(let d of h.garrison)$s(d,d.count*3);this.autoUpgrade(h.garrison,.3)}for(let h of t.parties)if(h.kind==="lord"){for(let d of h.troops)$s(d,d.count*4);if(this.autoUpgrade(h.troops,.5),h.inside){let d=this.lById.get(h.lordId)?.king?130:85;if(de(h.troops)<d)for(let f=0;f<lt.int(4,9);f++)we(h.troops,Ma(lt,h.faction,2),1);for(let f of h.troops)f.wounded=Math.max(0,f.wounded-Math.ceil(f.wounded*.4))}else for(let d of h.troops)d.wounded=Math.max(0,d.wounded-Math.ceil(d.wounded*.15))}for(let h of t.lords)!h.partyId&&t.time>=h.respawnAt&&this.spawnLordParty(h,lt.int(20,35));t.parties.filter(h=>h.kind==="bandit").length<14&&lt.chance(.7)&&this.spawnBandits();for(let h of Re)t.parties.filter(u=>u.kind==="caravan"&&u.faction===h).length<2&&lt.chance(.3)&&this.spawnCaravan(h);this.diplomacy(),ff(this),e%7===1&&e>1&&this.weekly(),this.emit("day",{day:e})}weekly(){let t=this.state,e=t.player,n=t.party,i=this.weeklyWages();if(i>0&&(e.gold>=i?(e.gold-=i,this.message(`\u0412\u0438\u043F\u043B\u0430\u0447\u0435\u043D\u043E \u043F\u043B\u0430\u0442\u043D\u044E \u0437\u0430\u0433\u043E\u043D\u0443: ${i} \u0437\u043E\u043B\u043E\u0442\u0430.`,"info")):(this.message(`\u041D\u0435 \u0432\u0438\u0441\u0442\u0430\u0447\u0438\u043B\u043E \u0437\u043E\u043B\u043E\u0442\u0430 \u043D\u0430 \u043F\u043B\u0430\u0442\u043D\u044E (${i})! \u0411\u043E\u0439\u043E\u0432\u0438\u0439 \u0434\u0443\u0445 \u043F\u0430\u0434\u0430\u0454.`,"danger"),e.gold=0,n.moraleBoost-=25)),t.contract){if(this.day>=t.contract.until&&!t.contract.vassal)this.message(`\u0412\u0430\u0448 \u043D\u0430\u0439\u043C\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u0437 ${Ht[t.contract.faction].name} \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0432\u0441\u044F.`,"info"),t.contract=null;else if(!t.contract.vassal){let a=this.contractPay();e.gold+=a,this.message(`\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043E \u043D\u0430\u0439\u043C\u0430\u043D\u0441\u044C\u043A\u0443 \u043F\u043B\u0430\u0442\u043D\u044E: ${a} \u0437\u043E\u043B\u043E\u0442\u0430.`,"good")}}let r=0;for(let a of t.settlements)a.owner==="player"&&(r+=Math.round((a.kind==="town"?450:a.kind==="castle"?160:90)*(.5+a.prosperity/100)));r&&(e.gold+=r,this.message(`\u041F\u0440\u0438\u0431\u0443\u0442\u043E\u043A \u0437 \u0432\u0430\u0448\u0438\u0445 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u044C: ${r} \u0437\u043E\u043B\u043E\u0442\u0430.`,"good"));for(let a of t.settlements){if(a.kind==="town"&&(Ah(lt,a),a.tavern={merc:lt.pick(Zu),count:lt.int(3,8)}),a.kind!=="village"&&a.owner!=="player"){let l=a.kind==="town"?110:60;if(de(a.garrison)<l&&!a.siege)for(let h=0;h<lt.int(5,10);h++)we(a.garrison,Ma(lt,a.faction==="player"?a.culture:a.faction,3),1)}if(a.kind!=="village")for(let l of a.garrison)l.wounded=0}let o=t.settlements.filter(a=>a.kind==="town");for(let a of Object.values(t.companions||{}))!a.hired&&lt.chance(.5)&&(a.location=lt.pick(o).id);Ch(this)}companionCount(){return $n(this.state).length}weeklyWages(){let t=this.state,e=Sa(t.party.troops)*(1-t.player.skills.leadership*.05);for(let n of t.settlements)n.owner==="player"&&(e+=Sa(n.garrison)*.5);for(let n of $n(t))e+=Ws(n.def);return Math.round(e)}contractPay(){return 40+de(this.state.party.troops)*4}autoUpgrade(t,e){for(let n of[...t]){let i=Xr(n);if(i>0&&lt.chance(e)){let r=Gt[n.id],o=lt.pick(r.up),a=Math.max(1,Math.floor(i*.5));n.xp-=a*r.upgradeXp,Mn(t,n.id,a),we(t,o,a)}}}playerMorale(){let t=this.state,e=t.player,n=de(t.party.troops)+this.companionCount(),i=50+e.skills.leadership*6+rf(e.inventory)+t.party.moraleBoost-Math.max(0,n-10)*.35;return Ys(e.inventory)<=0&&(i-=25),Math.round(oe(i,0,100))}diplomacy(){let t=this.state,e=this.day;for(let n=0;n<Re.length;n++)for(let i=n+1;i<Re.length;i++){let r=Re[n],o=Re[i],a=Ke(r,o),l=t.warSince[a]??-99,c=e-l,h=d=>Re.filter(u=>u!==d&&t.wars[Ke(d,u)]).length;if(t.wars[a])c>18&&lt.chance(.035)&&(delete t.wars[a],t.warSince[a]=e,this.message(`${Ht[r].name} \u0456 ${Ht[o].name} \u0443\u043A\u043B\u0430\u043B\u0438 \u043C\u0438\u0440.`,"war"),this.onPeace(r,o));else if(c>8&&h(r)<2&&h(o)<2){let d=Object.keys(t.wars).some(u=>!u.includes("player"));lt.chance(d?.012:.06)&&(t.wars[a]=!0,t.warSince[a]=e,this.message(`${Ht[r].name} \u043E\u0433\u043E\u043B\u043E\u0448\u0443\u0454 \u0432\u0456\u0439\u043D\u0443 ${Ht[o].name}!`,"danger"))}}for(let n of Re){let i=Ke("player",n);t.wars[i]&&e-(t.warSince[i]??0)>25&&lt.chance(.02)&&(delete t.wars[i],t.factions[n].relation=Math.max(t.factions[n].relation,-5),this.message(`${Ht[n].name} \u043F\u043E\u0433\u043E\u0434\u0436\u0443\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u0435\u0440\u0435\u043C\u0438\u0440\u2019\u044F \u0437 \u0432\u0430\u043C\u0438.`,"good"))}}onPeace(t,e){for(let n of this.state.settlements)n.siege&&(n.faction===t&&n.siege.faction===e||n.faction===e&&n.siege.faction===t)&&this.liftSiege(n)}liftSiege(t){if(t.siege){for(let e of t.siege.parties){let n=this.pById.get(e);n&&(n.ai.besieging=null,n.ai.mode="idle")}t.siege=null}}updateSieges(){let t=this.state;for(let e of t.settlements)if(e.siege){if(e.siege.player){let n=t.party;(Ye(n.x,n.y,e.x,e.y)>70||!this.isHostile(e.faction,"player"))&&(e.siege=null,this.message(`\u041E\u0431\u043B\u043E\u0433\u0443 ${e.name} \u0437\u043D\u044F\u0442\u043E.`,"info"));continue}if(e.siege.parties=e.siege.parties.filter(n=>{let i=this.pById.get(n);return i&&i.ai.besieging===e.id&&!i.battleId}),!e.siege.parties.length){e.siege=null;continue}t.time-e.siege.start>=Ea&&this.resolveSiege(e)}}resolveSiege(t){let e=this.state,n=t.siege.parties.map(l=>this.pById.get(l)).filter(Boolean),i=e.parties.filter(l=>l.inside===t.id&&!this.isHostile(l.faction,t.faction)),r=gi([{stacks:n.flatMap(l=>l.troops.map(c=>({key:l.id,troopId:c.id,count:c.count-c.wounded}))),bonus:1,woundChance:.3},{stacks:[...t.garrison.map(l=>({key:"garrison",troopId:l.id,count:l.count-l.wounded})),...i.flatMap(l=>l.troops.map(c=>({key:l.id,troopId:c.id,count:c.count-c.wounded})))],bonus:1.45,woundChance:.3}]);for(let l of n){let c=r.losses[0].get(l.id);c&&yi(l.troops,c)}let o=r.losses[1].get("garrison");o&&yi(t.garrison,o);for(let l of i){let c=r.losses[1].get(l.id);c&&yi(l.troops,c)}let a=t.owner==="player";if(r.winner===0){let l=n[0],c=t.faction;for(let d of i)this.removeParty(d);this.captureSettlement(t,l.faction,l.lordId||null),t.garrison=[];for(let d of l.troops){let u=Math.floor((d.count-d.wounded)*.3);u>0&&(Mn(l.troops,d.id,u),we(t.garrison,d.id,u))}let h=`${He(l.faction).name} \u0437\u0430\u0445\u043E\u043F\u043B\u044E\u0454 ${t.name} (\u0440\u0430\u043D\u0456\u0448\u0435: ${He(c).short})!`;this.message(a?`\u0412\u0438 \u0432\u0442\u0440\u0430\u0442\u0438\u043B\u0438 ${t.name}! ${h}`:h,a?"danger":"war");for(let d of n)d.ai.besieging=null,d.ai.mode="idle"}else{for(let l of n)ke(l.troops)<10?this.removeParty(l):(l.ai.besieging=null,this.flee(l,t));this.message(`\u0428\u0442\u0443\u0440\u043C ${t.name} \u0432\u0456\u0434\u0431\u0438\u0442\u043E.`,a?"good":"war")}t.siege=null}captureSettlement(t,e,n){t.faction=e,t.owner=n,t.prosperity=Math.max(10,t.prosperity-15);for(let i of this.state.settlements)i.boundTo===t.id&&(i.faction=e,i.owner=n);for(let i of this.state.lords)if(i.homeId===t.id&&i.faction!==e){let r=this.state.settlements.find(o=>o.faction===i.faction&&o.kind!=="village");r&&(i.homeId=r.id)}this.checkFactionDefeat()}checkFactionDefeat(){let t=this.state;for(let e of Re)if(!t.factions[e].defeated&&!t.settlements.some(n=>n.faction===e&&n.kind!=="village")){t.factions[e].defeated=!0,this.message(`${Ht[e].name} \u043F\u0440\u0438\u043F\u0438\u043D\u0438\u043B\u043E \u0456\u0441\u043D\u0443\u0432\u0430\u043D\u043D\u044F!`,"danger");for(let n of t.parties.filter(i=>i.faction===e))this.removeParty(n);for(let n of Object.keys(t.wars))n.split("|").includes(e)&&delete t.wars[n];t.contract?.faction===e&&(t.contract=null)}}addPlayerXp(t){let e=this.state.player;e.xp+=Math.round(t);let n=!1;for(;e.xp>=Gr(e.level);)e.xp-=Gr(e.level),e.level++,e.attrPoints+=1,e.skillPoints+=1,n=!0;n&&this.message(`\u041D\u043E\u0432\u0438\u0439 \u0440\u0456\u0432\u0435\u043D\u044C: ${e.level}! \u0420\u043E\u0437\u043F\u043E\u0434\u0456\u043B\u0456\u0442\u044C \u043E\u0447\u043A\u0438 \u0443 \u0432\u0456\u043A\u043D\u0456 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430.`,"good")}changeRelation(t,e){if(!this.state.factions[t])return;let n=this.state.factions[t],i=n.relation;n.relation=oe(n.relation+e,-100,100),Math.round(n.relation)!==Math.round(i)&&this.message(`\u0421\u0442\u043E\u0441\u0443\u043D\u043A\u0438 \u0437 ${Ht[t].name}: ${e>0?"+":""}${e} (\u0437\u0430\u0440\u0430\u0437 ${Math.round(n.relation)}).`,e>0?"good":"warn")}declarePlayerWar(t){let e=this.state;if(Ht[t]){if(e.contract?.faction===t){this.message(`\u0412\u0438 \u0437\u0440\u0430\u0434\u0438\u043B\u0438 ${Ht[t].name}. \u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u0440\u043E\u0437\u0456\u0440\u0432\u0430\u043D\u043E!`,"danger"),e.contract=null;for(let n of e.settlements)n.owner==="player"&&n.faction===t&&this.captureSettlement(n,"player","player")}e.wars[Ke("player",t)]=!0,e.warSince[Ke("player",t)]=this.day,this.changeRelation(t,-20)}}partyLimit(){return ju(this.state)}prisonerLimit(){return Qu(this.state)}isPlayerFull(){return de(this.state.party.troops)+this.companionCount()>=this.partyLimit()}partySpace(){return Math.max(0,this.partyLimit()-de(this.state.party.troops)-this.companionCount())}carryFood(){return Ys(this.state.player.inventory)}hasItem(t){return qs(this.state.player.inventory,t)>0}takeItem(t,e=1){return Xn(this.state.player.inventory,t,e)}giveItem(t,e=1){An(this.state.player.inventory,t,e)}foodIds(){return Bi}respawnPlayerAfterDefeat(){let t=this.state;for(let o of t.settlements)o.siege&&o.siege.player&&(o.siege=null);let e=t.settlements.filter(o=>o.kind==="town"&&!this.isHostile(o.faction,"player")),n=e.length?e:t.settlements,i=t.party,r=n.sort((o,a)=>_e(o.x,o.y,i.x,i.y)-_e(a.x,a.y,i.x,i.y))[0];return i.x=r.x+26,i.y=r.y-4,i.path=null,i.target=null,i.graceUntil=t.time+24,r}};var qr=3,v0={[ae.BEACH]:[214,198,146],[ae.PLAINS]:[128,160,88],[ae.FOREST]:[84,122,62],[ae.STEPPE]:[186,172,108],[ae.DESERT]:[214,190,136],[ae.SNOW]:[226,232,234],[ae.TAIGA]:[80,112,90],[ae.MOUNTAIN]:[132,120,104],[ae.PEAK]:[236,238,240]},Aa=class{constructor(t,e){this.canvas=t,this.ctx=t.getContext("2d"),this.game=e,this.cam={x:Tn/2,y:En/2,zoom:1},this.follow=!0,this.hover=null,this.mouse={x:0,y:0,down:!1,dragging:!1,sx:0,sy:0},this.keys=new Set,this.texture=null,this.onClickEntity=null,this.bindInput(),this.resize(),window.addEventListener("resize",()=>this.resize())}get world(){return this.game.world}resize(){let t=Math.min(window.devicePixelRatio||1,2);this.dpr=t,this.canvas.width=Math.floor(window.innerWidth*t),this.canvas.height=Math.floor(window.innerHeight*t),this.canvas.style.width=`${window.innerWidth}px`,this.canvas.style.height=`${window.innerHeight}px`}buildTexture(t){let n=t.gen.field(qr),{w:i,h:r,height:o,biome:a}=n,l=document.createElement("canvas");l.width=i,l.height=r;let c=l.getContext("2d"),h=c.createImageData(i,r),d=h.data,u=cn(t.state.seed+5);for(let M=0;M<r;M++)for(let v=0;v<i;v++){let S=M*i+v,T=a[S],C=o[S],_,A,R;if(T===ae.WATER){let D=oe(-C*2.2,0,1);_=70-D*42,A=128-D*62,R=160-D*58,C>-.025&&(_+=30,A+=30,R+=22)}else{let D=v0[T],O=oe((C-.1)*.35,-.05,.25);_=D[0]*(1-O*.4),A=D[1]*(1-O*.4),R=D[2]*(1-O*.2);let N=o[S+(v<i-1?1:0)]-o[S-(v>0?1:0)],z=o[S+(M<r-1?i:0)]-o[S-(M>0?i:0)],q=oe(1-(N+z)*5.5,.62,1.28),$=.96+u()*.08;_*=q*$,A*=q*$,R*=q*$}let I=S*4;d[I]=_,d[I+1]=A,d[I+2]=R,d[I+3]=255}let f=new Uint8ClampedArray(d);for(let M=1;M<r-1;M++)for(let v=1;v<i-1;v++){let S=(M*i+v)*4;for(let T=0;T<3;T++)d[S+T]=(f[S+T]*4+f[S+T-4]+f[S+T+4]+f[S+T-i*4]+f[S+T+i*4])/8}c.putImageData(h,0,0),c.save(),c.scale(1/qr,1/qr),c.lineCap="round",c.lineJoin="round";for(let M of[[7,"rgba(90,70,40,0.35)"],[4,"rgba(196,170,120,0.85)"]]){c.lineWidth=M[0],c.strokeStyle=M[1];for(let v of t.roads)c.beginPath(),v.forEach(([S,T],C)=>C?c.lineTo(S,T):c.moveTo(S,T)),c.stroke()}c.restore(),this.texture=l;let p=t.nav,g=[],m=[],y=[],x=cn(t.state.seed+9);for(let M=0;M<p.h;M++)for(let v=0;v<p.w;v++){let S=M*p.w+v;if(p.road[S])continue;let T=p.biome[S],C=(v+.5)*Te,_=(M+.5)*Te;if(T===ae.FOREST)for(let A=0;A<2;A++)g.push([C+(x()-.5)*Te,_+(x()-.5)*Te,4+x()*3]);else if(T===ae.TAIGA)for(let A=0;A<2;A++)m.push([C+(x()-.5)*Te,_+(x()-.5)*Te,5+x()*3]);else T===ae.PLAINS&&x()<.05?g.push([C+(x()-.5)*Te,_+(x()-.5)*Te,3.5+x()*2]):(T===ae.MOUNTAIN||T===ae.PEAK)&&(v+M)%2===0&&x()<.8&&y.push([C+(x()-.5)*Te*.6,_+(x()-.5)*Te*.6,(T===ae.PEAK?13:9)+x()*5,T===ae.PEAK])}g.sort((M,v)=>M[1]-v[1]),m.sort((M,v)=>M[1]-v[1]),y.sort((M,v)=>M[1]-v[1]),this.decor={trees:g,pines:m,peaks:y}}worldToScreen(t,e){let n=this.cam.zoom*this.dpr;return[(t-this.cam.x)*n+this.canvas.width/2,(e-this.cam.y)*n+this.canvas.height/2]}screenToWorld(t,e){let n=this.cam.zoom*this.dpr;return[(t*this.dpr-this.canvas.width/2)/n+this.cam.x,(e*this.dpr-this.canvas.height/2)/n+this.cam.y]}centerOnPlayer(){let t=this.world.state.party;this.cam.x=t.x,this.cam.y=t.y,this.follow=!0}clampCam(){this.cam.x=oe(this.cam.x,0,Tn),this.cam.y=oe(this.cam.y,0,En)}bindInput(){let t=this.canvas;t.addEventListener("contextmenu",e=>e.preventDefault()),t.addEventListener("mousedown",e=>{this.mouse.down=!0,this.mouse.button=e.button,this.mouse.sx=e.clientX,this.mouse.sy=e.clientY,this.mouse.camX=this.cam.x,this.mouse.camY=this.cam.y,this.mouse.dragging=!1}),window.addEventListener("mouseup",e=>{this.mouse.down&&(this.mouse.down=!1,!this.mouse.dragging&&e.target===t&&this.mouse.button===0&&this.click(e.clientX,e.clientY),this.mouse.dragging=!1)}),t.addEventListener("mousemove",e=>{if(this.mouse.x=e.clientX,this.mouse.y=e.clientY,this.mouse.down){let n=e.clientX-this.mouse.sx,i=e.clientY-this.mouse.sy;!this.mouse.dragging&&n*n+i*i>36&&(this.mouse.dragging=!0),this.mouse.dragging&&(this.follow=!1,this.cam.x=this.mouse.camX-n/this.cam.zoom,this.cam.y=this.mouse.camY-i/this.cam.zoom,this.clampCam())}}),t.addEventListener("wheel",e=>{e.preventDefault();let[n,i]=this.screenToWorld(e.clientX,e.clientY),r=Math.exp(-e.deltaY*.0015);this.cam.zoom=oe(this.cam.zoom*r,.3,4);let[o,a]=this.screenToWorld(e.clientX,e.clientY);this.cam.x+=n-o,this.cam.y+=i-a,this.clampCam()},{passive:!1}),t.addEventListener("mouseleave",()=>{this.hover=null})}pick(t,e){let n=this.world;if(!n)return null;let i=n.state,[r,o]=this.screenToWorld(t,e),a=this.cam.zoom,l=null,c=1/0,h=(d,u,f)=>{let p=_e(u.x,u.y,r,o);p<f*f&&p<c&&(c=p,l={type:d,id:u.id,e:u})};for(let d of i.battles)this.isVisible(d)&&h("battle",d,16/a);for(let d of i.parties)!d.inside&&this.isVisible(d)&&!d.battleId&&h("party",d,12/a);if(!l)for(let d of i.settlements)h("settlement",d,(d.kind==="village"?14:20)/Math.min(a,1.6));return l||h("player",i.party,10/a),l}isVisible(t){let e=this.world.state.party,n=ps*(this.world.isNight()?.9:1.3);return _e(t.x,t.y,e.x,e.y)<n*n}click(t,e){let n=this.pick(t,e),[i,r]=this.screenToWorld(t,e);this.onClickEntity&&this.onClickEntity(n,i,r)}update(t){let e=700*t/this.cam.zoom,n=!1;if((this.keys.has("ArrowLeft")||this.keys.has("KeyA"))&&(this.cam.x-=e,n=!0),(this.keys.has("ArrowRight")||this.keys.has("KeyD"))&&(this.cam.x+=e,n=!0),(this.keys.has("ArrowUp")||this.keys.has("KeyW"))&&(this.cam.y-=e,n=!0),(this.keys.has("ArrowDown")||this.keys.has("KeyS"))&&(this.cam.y+=e,n=!0),n&&(this.follow=!1,this.clampCam()),this.follow&&this.world){let i=this.world.state.party,r=1-Math.exp(-t*5);this.cam.x+=(i.x-this.cam.x)*r,this.cam.y+=(i.y-this.cam.y)*r}this.hover=this.mouse.down?null:this.pick(this.mouse.x,this.mouse.y)}draw(){let t=this.world,e=this.ctx,n=this.canvas;if(e.setTransform(1,0,0,1,0,0),e.fillStyle="#1c4266",e.fillRect(0,0,n.width,n.height),!t||!this.texture)return;let i=t.state,r=this.cam.zoom*this.dpr;e.setTransform(r,0,0,r,n.width/2-this.cam.x*r,n.height/2-this.cam.y*r),e.imageSmoothingEnabled=!0,e.drawImage(this.texture,0,0,this.texture.width*qr,this.texture.height*qr);let[o,a]=this.screenToWorld(0,0),[l,c]=this.screenToWorld(window.innerWidth,window.innerHeight),h=(g,m,y=30)=>g>o-y&&g<l+y&&m>a-y&&m<c+y;this.drawDecor(e,h);let d=i.party;if(d.path&&d.pi<d.path.length){e.save(),e.setLineDash([6,6]),e.lineWidth=2/this.cam.zoom,e.strokeStyle="rgba(255,240,200,0.8)",e.beginPath(),e.moveTo(d.x,d.y);for(let m=d.pi;m<d.path.length;m++)e.lineTo(d.path[m][0],d.path[m][1]);e.stroke(),e.restore();let g=d.path[d.path.length-1];e.strokeStyle="rgba(255,240,200,0.9)",e.lineWidth=2/this.cam.zoom,e.beginPath(),e.arc(g[0],g[1],5/this.cam.zoom,0,Math.PI*2),e.stroke()}for(let g of i.settlements)h(g.x,g.y,60)&&this.drawSettlement(e,g);for(let g of i.quests){if(g.status!=="active")continue;let m=null;if(g.type==="delivery")m=t.sById.get(g.target);else if(g.type==="bounty"){let y=t.sById.get(g.giver),x=t.pById.get(g.targetParty);m=x&&this.isVisible(x)?x:y}m&&h(m.x,m.y)&&this.drawQuestMarker(e,m.x,m.y)}for(let g of i.battles)this.isVisible(g)&&h(g.x,g.y)&&this.drawBattle(e,g);let u=i.parties.filter(g=>!g.inside&&this.isVisible(g)&&h(g.x,g.y)).sort((g,m)=>g.y-m.y);for(let g of u)this.drawParty(e,g,!1);this.drawParty(e,d,!0),e.save(),e.strokeStyle="rgba(255,255,255,0.07)",e.lineWidth=2/this.cam.zoom,e.beginPath(),e.arc(d.x,d.y,ps*(t.isNight()?.9:1.3),0,Math.PI*2),e.stroke(),e.restore(),e.setTransform(1,0,0,1,0,0);let f=i.time%24,p=0;f<5?p=1:f<7?p=1-(f-5)/2:f>=21?p=1:f>=19&&(p=(f-19)/2),p>0&&(e.fillStyle=`rgba(12,20,52,${.38*p})`,e.fillRect(0,0,n.width,n.height)),this.hover&&this.drawHoverRing(e)}drawDecor(t,e){let n=this.cam.zoom;if(!this.decor)return;let{trees:i,pines:r,peaks:o}=this.decor;for(let[a,l,c,h]of o)e(a,l)&&(t.fillStyle=h?"#a8a29a":"#7b705f",t.beginPath(),t.moveTo(a-c,l+c*.45),t.lineTo(a,l-c*.8),t.lineTo(a+c,l+c*.45),t.closePath(),t.fill(),t.fillStyle=h?"#d9d6d0":"#968a76",t.beginPath(),t.moveTo(a,l-c*.8),t.lineTo(a+c,l+c*.45),t.lineTo(a+c*.15,l+c*.45),t.closePath(),t.fill(),t.fillStyle="#f4f4f2",t.beginPath(),t.moveTo(a,l-c*.8),t.lineTo(a-c*.32,l-c*.28),t.lineTo(a+c*.32,l-c*.28),t.closePath(),t.fill());if(!(n<.45)){t.fillStyle="rgba(40,70,30,0.9)",t.beginPath();for(let[a,l,c]of i)e(a,l)&&(t.moveTo(a+c,l),t.arc(a,l,c,0,Math.PI*2));t.fill(),t.fillStyle="rgba(88,128,60,0.9)",t.beginPath();for(let[a,l,c]of i)e(a,l)&&(t.moveTo(a-c*.25+c*.55,l-c*.3),t.arc(a-c*.25,l-c*.3,c*.55,0,Math.PI*2));t.fill(),t.fillStyle="rgba(30,62,48,0.95)",t.beginPath();for(let[a,l,c]of r)e(a,l)&&(t.moveTo(a-c*.55,l+c*.5),t.lineTo(a,l-c),t.lineTo(a+c*.55,l+c*.5),t.closePath());t.fill()}}iconScale(){return oe(.75+this.cam.zoom*.35,.8,1.6)/this.cam.zoom}drawSettlement(t,e){let n=this.iconScale(),i=He(e.faction),r=e.x,o=e.y;if(t.save(),t.translate(r,o),t.scale(n,n),t.lineWidth=1.2,t.strokeStyle="#2a2018",e.kind==="town"){t.fillStyle="#d7cbb0",t.fillRect(-14,-6,28,12),t.strokeRect(-14,-6,28,12);for(let d of[-15,-3,9])t.fillStyle="#c9bb9c",t.fillRect(d,-12,6,18),t.strokeRect(d,-12,6,18),t.fillStyle="#8b3a2a",t.beginPath(),t.moveTo(d-1,-12),t.lineTo(d+3,-18),t.lineTo(d+7,-12),t.closePath(),t.fill(),t.stroke();this.drawFlag(t,0,-18,i.color,1.1)}else if(e.kind==="castle"){t.fillStyle="#b9b2a4",t.fillRect(-9,-8,18,14),t.strokeRect(-9,-8,18,14),t.fillStyle="#a39c8e",t.fillRect(-4,-16,8,10),t.strokeRect(-4,-16,8,10);for(let d of[-9,-3,3])t.fillRect(d,-10,3,2);this.drawFlag(t,0,-16,i.color,1)}else for(let[d,u]of[[-7,2],[2,-2],[6,5]])t.fillStyle="#c8a878",t.fillRect(d-3,u-2,7,5),t.strokeRect(d-3,u-2,7,5),t.fillStyle="#7a5230",t.beginPath(),t.moveTo(d-4,u-2),t.lineTo(d+.5,u-6),t.lineTo(d+5,u-2),t.closePath(),t.fill();if(e.siege&&(t.strokeStyle="rgba(220,40,20,0.9)",t.setLineDash([4,3]),t.lineWidth=2,t.beginPath(),t.arc(0,-2,22,0,Math.PI*2),t.stroke(),t.setLineDash([])),e.kind==="village"&&this.cam.zoom<.55){t.restore();return}let a=e.kind==="village"?10:12.5;t.font=`${e.kind==="village"?"":"bold "}${a}px Alegreya, Georgia, serif`,t.textAlign="center",t.textBaseline="top";let l=e.name,c=t.measureText(l).width,h=(e.kind==="village",9);t.fillStyle="rgba(20,16,10,0.55)",t.fillRect(-c/2-4,h-1,c+8,a+4),t.fillStyle=e.kind==="village"?"#efe6d2":"#fff6e0",t.fillText(l,0,h+1),t.fillStyle=i.color,t.fillRect(-c/2-4,h+a+3,c+8,2),e.owner==="player"&&(t.fillStyle="#f5d76e",t.fillText("\u2605",c/2+10,h+1)),t.restore()}drawFlag(t,e,n,i,r){t.strokeStyle="#2a2018",t.lineWidth=1,t.beginPath(),t.moveTo(e,n),t.lineTo(e,n-9*r),t.stroke(),t.fillStyle=i,t.beginPath(),t.moveTo(e,n-9*r),t.lineTo(e+8*r,n-7*r),t.lineTo(e,n-5*r),t.closePath(),t.fill()}drawParty(t,e,n){let i=this.iconScale(),r=n?{color:"#f5d76e"}:He(e.faction),o=de(e.troops)+(n?1:0),a=5+Math.min(5,Math.sqrt(o)*.6);t.save(),t.translate(e.x,e.y),t.scale(i,i),t.fillStyle="rgba(0,0,0,0.3)",t.beginPath(),t.ellipse(1.5,2.5,a,a*.6,0,0,Math.PI*2),t.fill(),t.fillStyle=r.color,t.strokeStyle=n?"#fff":e.kind==="bandit"?"#c0392b":"#1b140e",t.lineWidth=n?2.2:1.6,t.beginPath(),t.arc(0,0,a,0,Math.PI*2),t.fill(),t.stroke(),t.fillStyle=n?"#3b2a10":"#fff",t.font=`bold ${a*1.25}px sans-serif`,t.textAlign="center",t.textBaseline="middle";let l=n?"\u2605":e.kind==="bandit"?"\u2620":e.kind==="caravan"?"\u2696":"\u2691";if(t.fillText(l,0,.5),this.cam.zoom>.8||n){t.font="bold 9px sans-serif",t.fillStyle="rgba(0,0,0,0.6)";let c=String(o),h=t.measureText(c).width;t.fillRect(a+1,-5,h+4,10),t.fillStyle="#fff",t.textAlign="left",t.fillText(c,a+3,.5)}t.restore()}drawBattle(t,e){let n=this.iconScale(),i=performance.now()/300;t.save(),t.translate(e.x,e.y),t.scale(n,n),t.fillStyle=`rgba(200,40,20,${.25+.15*Math.sin(i)})`,t.beginPath(),t.arc(0,0,16,0,Math.PI*2),t.fill(),t.font="bold 18px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillStyle="#fff",t.strokeStyle="#000",t.lineWidth=3,t.strokeText("\u2694",0,0),t.fillText("\u2694",0,0),t.restore()}drawQuestMarker(t,e,n){let i=this.iconScale(),r=performance.now()/250;t.save(),t.translate(e,n-34*i+Math.sin(r)*2*i),t.scale(i,i),t.font="bold 18px sans-serif",t.textAlign="center",t.fillStyle="#ffd34d",t.strokeStyle="#3a2a00",t.lineWidth=3,t.strokeText("!",0,0),t.fillText("!",0,0),t.restore()}drawHoverRing(t){let e=this.hover;if(!e||!e.e)return;let[n,i]=this.worldToScreen(e.e.x,e.e.y);t.strokeStyle="rgba(255,230,160,0.85)",t.lineWidth=2*this.dpr,t.beginPath(),t.arc(n,i,(e.type==="settlement"?24:14)*this.dpr,0,Math.PI*2),t.stroke()}};function b(s,t,...e){let n=document.createElement(s);if(t)for(let[i,r]of Object.entries(t))r==null||r===!1||(i==="class"?n.className=r:i==="style"&&typeof r=="object"?Object.assign(n.style,r):i.startsWith("on")&&typeof r=="function"?n.addEventListener(i.slice(2).toLowerCase(),r):i==="html"?n.innerHTML=r:i in n&&i!=="list"?n[i]=r:n.setAttribute(i,r===!0?"":r));return gf(n,e),n}function gf(s,t){for(let e of t)e==null||e===!1||(Array.isArray(e)?gf(s,e):e instanceof Node?s.appendChild(e):s.appendChild(document.createTextNode(String(e))))}function bt(s,t,e="",n={}){return b("button",{class:`btn ${e}`,onclick:t,disabled:n.disabled,title:n.title},s)}function Yr(s){return b("span",{class:"faction-dot",style:{background:s}})}function Ra(s,t=""){return b("div",{class:`bar ${t}`},b("div",{style:{width:`${Math.max(0,Math.min(1,s))*100}%`}}))}var Ca=class{constructor(t){this.root=t,this.stack=[]}get open(){return this.stack.length>0}show(t){let e=b("div",{class:"modal-layer"}),n=b("div",{class:`window ${t.cls||""}`}),i=t.closable!==!1,r=b("div",{class:"window-title"},t.title||"",b("span",{class:"spacer"}),i?b("button",{class:"window-close",onclick:()=>this.close(l),title:"\u0417\u0430\u043A\u0440\u0438\u0442\u0438 (Esc)"},"\xD7"):null),o=b("div",{class:"window-body"});n.append(r,o);let a=b("div",{class:"window-footer"});n.append(a),e.append(n),this.root.append(e);let l={layer:e,win:n,body:o,footer:a,title:r,opts:t,closable:i};return this.stack.push(l),this.fill(l,t),l}fill(t,e){t.body.innerHTML="",t.footer.innerHTML="",e.body&&t.body.append(e.body),e.footer&&e.footer.length?(t.footer.style.display="",t.footer.append(...e.footer.filter(Boolean))):t.footer.style.display="none"}update(t,e){let n=t.body.scrollTop;Object.assign(t.opts,e),e.title!=null&&(t.title.firstChild.textContent=e.title),this.fill(t,t.opts),t.body.scrollTop=n}close(t){if(t||(t=this.stack[this.stack.length-1]),!t)return;let e=this.stack.indexOf(t);e<0||(this.stack.splice(e,1),t.layer.remove(),t.opts.onClose&&t.opts.onClose())}closeTop(){let t=this.stack[this.stack.length-1];return t&&t.closable?(this.close(t),!0):!1}closeAll(){for(;this.stack.length;)this.stack.pop().layer.remove()}};function Ks({text:s,scene:t,options:e}){let n=b("div",{class:"options"});for(let r of e){if(!r)continue;let o=b("button",{class:`btn opt ${r.cls||""}`,disabled:r.disabled,title:r.title||"",onclick:r.onClick},r.label,r.hint?b("span",{class:"hint"},r.hint):null);n.append(o)}let i=b("div",null,t||null,b("div",{class:"text"},s));return b("div",{class:"gmenu"},i,n)}var Lh={day:["#9cc6e8","#e9dcb8"],dusk:["#5a4a7a","#e7a266"],night:["#101a33","#34426b"]};function _0(s){return s>=7&&s<18?Lh.day:s>=18&&s<21||s>=5&&s<7?Lh.dusk:Lh.night}function ms(s,t="#8b2b20",e=12){let[n,i]=_0(e),r=s==="snow"?"#dfe6ea":"#6f8a4c",o="";s==="town"?o=`
      <rect x="40" y="70" width="320" height="50" fill="#b9ab8e" stroke="#3b2a1c"/>
      ${[40,110,190,270,340].map(l=>`<rect x="${l-12}" y="45" width="24" height="75" fill="#a89a7c" stroke="#3b2a1c"/><path d="M${l-16} 45 L${l} 22 L${l+16} 45Z" fill="#7d3326" stroke="#3b2a1c"/>`).join("")}
      <rect x="182" y="85" width="36" height="35" fill="#3b2a1c" rx="16"/>
      <line x1="200" y1="22" x2="200" y2="4" stroke="#3b2a1c" stroke-width="2"/>
      <path d="M200 4 L226 9 L200 15Z" fill="${t}"/>
      ${[70,150,240,310].map(l=>`<rect x="${l-6}" y="58" width="12" height="12" fill="#3b2a1c" opacity=".4"/>`).join("")}`:s==="castle"?o=`
      <path d="M60 120 L110 60 L290 60 L340 120Z" fill="#7a8a5a"/>
      <rect x="120" y="50" width="160" height="50" fill="#a39c8e" stroke="#3b2a1c"/>
      ${[120,150,180,210,240,270].map(l=>`<rect x="${l}" y="42" width="14" height="10" fill="#a39c8e" stroke="#3b2a1c"/>`).join("")}
      <rect x="175" y="18" width="50" height="82" fill="#978f80" stroke="#3b2a1c"/>
      ${[175,193,211].map(l=>`<rect x="${l}" y="10" width="12" height="10" fill="#978f80" stroke="#3b2a1c"/>`).join("")}
      <rect x="192" y="75" width="16" height="25" rx="8" fill="#3b2a1c"/>
      <line x1="200" y1="10" x2="200" y2="-8" stroke="#3b2a1c" stroke-width="2"/>
      <path d="M200 -8 L226 -3 L200 3Z" fill="${t}"/>`:s==="village"?o=[60,140,230,310].map((l,c)=>`
      <rect x="${l}" y="${80-c%2*8}" width="46" height="34" fill="#c8a878" stroke="#3b2a1c"/>
      <path d="M${l-6} ${80-c%2*8} L${l+23} ${56-c%2*8} L${l+52} ${80-c%2*8}Z" fill="#8a6a3a" stroke="#3b2a1c"/>
      <rect x="${l+18}" y="${98-c%2*8}" width="10" height="16" fill="#3b2a1c"/>`).join("")+'<path d="M0 118 Q100 104 200 116 T400 112 L400 130 L0 130Z" fill="#c9b36a"/>':s==="camp"?o=[80,180,280].map(l=>`<path d="M${l-40} 115 L${l} 55 L${l+40} 115Z" fill="#d8ccb0" stroke="#3b2a1c"/><path d="M${l-8} 115 L${l} 85 L${l+8} 115Z" fill="#3b2a1c"/>`).join("")+`<line x1="330" y1="115" x2="330" y2="40" stroke="#3b2a1c" stroke-width="2"/><path d="M330 40 L360 46 L330 52Z" fill="${t}"/>`:s==="battle"?o=`
      <g stroke="#2b2118" stroke-width="3">
        ${[60,110,160].map(l=>`<line x1="${l}" y1="118" x2="${l+18}" y2="30"/>`).join("")}
        ${[240,290,340].map(l=>`<line x1="${l}" y1="118" x2="${l-18}" y2="30"/>`).join("")}
      </g>
      <path d="M150 60 L250 110 M250 60 L150 110" stroke="#c9c9c9" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 60 L250 110 M250 60 L150 110" stroke="#555" stroke-width="2" stroke-linecap="round"/>
      <circle cx="200" cy="85" r="8" fill="${t}" stroke="#2b2118"/>`:s==="arena"&&(o=`<ellipse cx="200" cy="100" rx="170" ry="30" fill="#c9b07a" stroke="#3b2a1c"/>
      <path d="M30 100 L30 60 Q200 30 370 60 L370 100" fill="none" stroke="#7a5a3a" stroke-width="10"/>
      ${[60,110,160,240,290,340].map(l=>`<line x1="${l}" y1="98" x2="${l}" y2="58" stroke="#5a3a1a" stroke-width="4"/>`).join("")}`);let a=`<svg viewBox="0 -12 400 142" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n}"/><stop offset="1" stop-color="${i}"/></linearGradient></defs>
    <rect x="0" y="-12" width="400" height="142" fill="url(#skyg)"/>
    <path d="M0 100 Q80 80 160 96 T320 90 T400 94 L400 130 L0 130Z" fill="${r}" opacity=".85"/>
    <path d="M0 112 Q120 100 220 112 T400 108 L400 130 L0 130Z" fill="${r}"/>
    ${o}
  </svg>`;return b("div",{class:"scene",html:a})}var ka={};c0(ka,{allyColor:()=>La,applyFieldResult:()=>Na,applySiegeResult:()=>Ua,attemptRetreat:()=>Hh,autoFieldBattle:()=>Fh,battleTerrain:()=>kh,companionHeroes:()=>Ia,companionSpecs:()=>Uh,playerHero:()=>Pa,playerPartyReady:()=>S0,siegeDefenders:()=>Zr,startArena:()=>zh,startFieldBattle:()=>Da,startPlayerSiege:()=>Oh,startSiegeAssault:()=>Bh,woundedCount:()=>Vi});function Pa(s){let t=s.state.player,e={...t.skills};for(let n of["surgery","tactics","looting"])e[n]=hn(s.state,n);return{key:"player",name:t.name,hp:t.hp,maxHp:Wn(t),equipment:{...t.equipment},skills:e,attrs:{...t.attrs},level:t.level}}function Uh(s){return $n(s.state).filter(t=>t.st.hp>5).map(t=>{let e={};for(let i of Object.keys(s.state.player.skills))e[i]=t.def.skills[i]||0;let n=6+Math.round(t.def.level*.6);return{key:`comp:${t.id}`,id:t.id,name:t.def.name,hp:t.st.hp,maxHp:t.def.hp,equipment:{...t.def.equipment},skills:e,attrs:{str:n,agi:n,int:6,cha:6},level:t.def.level}})}function Ia(s){return $n(s.state).filter(t=>t.st.hp>5).map(t=>({key:`comp:${t.id}`,hp:t.st.hp,power:12+t.def.level*2,armor:20}))}function M0(s,t){let e=s.state;if(t.companionHp)for(let[n,i]of Object.entries(t.companionHp))e.companions[n]&&(e.companions[n].hp=Math.max(1,Math.round(i)));if(t.heroesDown)for(let n of t.heroesDown){let i=String(n).startsWith("comp:")?n.slice(5):null;i&&e.companions[i]&&(e.companions[i].hp=1)}}function Gi(s){let t=[];for(let e of s)for(let n of e.troops){let i=n.count-n.wounded;i>0&&t.push({key:e.id,troopId:n.id,count:i})}return t}function La(s){return s==="nordheim"?"#7d3c98":"#3f6fb5"}function kh(s,t,e){return ef[s.nav.biomeAt(t,e)]||"plains"}function Da(s,{enemies:t,allies:e=[],mapBattle:n=null}){let i=s.world,r=i.state,o=r.party;for(let c of[...t,...e])c.held=!0;n&&(n.playerJoined=!0);let a=t.map(c=>c.name).join(", "),l={kind:"field",terrain:kh(i,o.x,o.y),hour:r.time%24,sides:[{name:"\u0412\u0430\u0448\u0456 \u0441\u0438\u043B\u0438",units:[...Gi([o]),...Gi(e)],hero:Pa(i),companions:Uh(i),playerKey:"player"},{name:a,units:Gi(t),hero:null}],factionColors:[La(t[0]?.faction),He(t[0]?.faction).color],enemyFaction:t[0]?.faction,allyFaction:e[0]?.faction};s.startBattle(l,c=>{for(let d of[...t,...e])d.held=!1;let h=Na(s,{enemies:t,allies:e,mapBattle:n},c);s.ui.showBattleResult(h)})}function Fh(s,{enemies:t,allies:e=[],mapBattle:n=null}){let i=s.world,r=i.state.party,o=hn(i.state,"tactics"),a=gi([{stacks:[...Gi([r]),...Gi(e)].map(h=>({key:h.key,troopId:h.troopId,count:h.count})),heroes:Ia(i),bonus:1+o*.04,woundChance:.25+hn(i.state,"surgery")*.05},{stacks:Gi(t).map(h=>({key:h.key,troopId:h.troopId,count:h.count})),heroes:[],bonus:1,woundChance:.3}]),l={outcome:a.winner===0?"victory":"defeat",losses:a.losses,playerDown:!1,playerKills:[],auto:!0,heroesDown:[...a.heroesDown]};a.winner===1&&(l.outcome="autoDefeat");let c=Na(s,{enemies:t,allies:e,mapBattle:n},l);s.ui.showBattleResult(c)}function w0(s){let t=0,e=0;if(!s)return{killed:t,wounded:e};for(let n of Object.values(s.killed))t+=n;for(let n of Object.values(s.wounded))e+=n;return{killed:t,wounded:e}}function Dh(s,t){if(t)for(let e of["killed","wounded"])for(let[n,i]of Object.entries(t[e]))s[e][n]=(s[e][n]||0)+i}function Na(s,t,e){let n=s.world,i=n.state,r=i.player,o=i.party,{enemies:a,allies:l,mapBattle:c}=t,h={outcome:e.outcome,playerLoss:{killed:{},wounded:{}},enemyLoss:{killed:{},wounded:{}},allyLoss:{killed:{},wounded:{}},gold:0,items:[],prisoners:{},xp:0,renown:0,kills:e.playerKills?.length||0,notes:[]};i.stats.battles++,yi(o.troops,e.losses[0].get("player")),Dh(h.playerLoss,e.losses[0].get("player"));for(let f of l){let p=e.losses[0].get(f.id);yi(f.troops,p),Dh(h.allyLoss,p)}for(let f of a){let p=e.losses[1].get(f.id);yi(f.troops,p),Dh(h.enemyLoss,p)}e.playerHp!=null&&(r.hp=oe(e.playerHp,1,Wn(r))),M0(n,e);let d=w0(h.enemyLoss),u=0;for(let f of["killed","wounded"])for(let[p,g]of Object.entries(h.enemyLoss[f]))u+=Gt[p].tier*g;if(e.outcome==="victory"){i.stats.won++,r.battlesWon++;let f=hn(i,"looting");for(let x of a)if(h.gold+=Math.round((x.gold||0)*(.5+f*.08)),x.goods)for(let M of x.goods)h.items.push([M.id,M.qty]);let p=.07*(1+f*.15),g={};for(let x of["killed","wounded"])for(let[M,v]of Object.entries(h.enemyLoss[x])){let S=Gt[M];for(let T=0;T<v;T++){if(!lt.chance(p))continue;let C=Object.values(S.eq).flat().filter(Boolean),_=lt.pick(C);_&&!wt[_].training&&(g[_]=(g[_]||0)+1)}}for(let[x,M]of Object.entries(g))h.items.push([x,M]);let m=n.prisonerLimit(),y=de(o.prisoners);for(let x of a)for(let M of[...x.troops]){let v=Math.min(M.wounded,Math.max(0,m-y));if(v<=0)continue;let S=M.id;Mn(x.troops,S,v,!0),we(o.prisoners,S,v),h.prisoners[S]=(h.prisoners[S]||0)+v,y+=v}for(let x of a)for(let M of x.prisoners||[])Gt[M.id].faction!=="bandits"&&(h.notes.push(`\u0417\u0432\u0456\u043B\u044C\u043D\u0435\u043D\u043E \u043F\u043E\u043B\u043E\u043D\u0435\u043D\u0438\u0445: ${Gt[M.id].name} \xD7${M.count}.`),h.freed=h.freed||[],h.freed.push({id:M.id,count:M.count}));for(let x of a)ke(x.troops)<=0||x.kind!=="lord"?n.removeParty(x,!0):(n.flee(x,o),x.fleeUntil=i.time+8,x.fledFrom="player"),x.lordId&&h.notes.push(`${n.lById.get(x.lordId).name} \u0432\u0442\u0456\u043A \u0437 \u043F\u043E\u043B\u044F \u0431\u043E\u044E.`);h.xp=u*(e.auto?4:9)+h.kills*25,h.renown=Math.round(u/(a.every(x=>x.kind==="bandit")?6:3)),o.moraleBoost+=8;for(let x of a)Ht[x.faction]&&i.contract&&n.atWar(i.contract.faction,x.faction)&&n.changeRelation(i.contract.faction,1);for(let x of l)Ht[x.faction]&&n.changeRelation(x.faction,3);if(a.some(x=>x.kind==="bandit")){let x=b0(n,o.x,o.y);x&&Ht[x.faction]&&lt.chance(.5)&&n.changeRelation(x.faction,1)}}else if(e.outcome==="retreat"){o.graceUntil=i.time+3,Nh(n,o,a[0]),h.xp=Math.round(u*4+h.kills*25),o.moraleBoost-=6;for(let f of l)ke(f.troops)<=0&&n.removeParty(f);for(let f of a)ke(f.troops)<=0&&n.removeParty(f,!0)}else if(e.outcome==="autoDefeat"){o.graceUntil=i.time+4,Nh(n,o,a[0]),o.moraleBoost-=12,h.notes.push("\u0412\u0430\u0448\u0456 \u0432\u043E\u0457\u043D\u0438 \u0437\u0430\u0437\u043D\u0430\u043B\u0438 \u043F\u043E\u0440\u0430\u0437\u043A\u0438, \u0430\u043B\u0435 \u0432\u0430\u043C \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0456\u0434\u0441\u0442\u0443\u043F\u0438\u0442\u0438.");for(let f of l)ke(f.troops)<=0&&n.removeParty(f)}else{let f=Math.round(r.gold*lt.range(.2,.4));r.gold-=f;let p=de(o.troops),g=a[0];if(g)for(let x of o.troops)we(g.prisoners,x.id,Math.ceil(x.count*.4));o.troops=[];for(let x of[...r.inventory])wt[x.id].type==="good"&&lt.chance(.6)&&r.inventory.splice(r.inventory.indexOf(x),1);for(let x of a)ke(x.troops)<=0&&n.removeParty(x,!0);let m=lt.int(1,3);n.skipTime(m*24);let y=n.respawnPlayerAfterDefeat();r.hp=Math.max(r.hp,Wn(r)*.3),o.moraleBoost=0,h.notes.push(`\u0412\u0430\u0441 \u0443\u0437\u044F\u043B\u0438 \u0432 \u043F\u043E\u043B\u043E\u043D. \u0412\u0442\u0440\u0430\u0447\u0435\u043D\u043E ${f} \u0437\u043E\u043B\u043E\u0442\u0430${p?` \u0456 \u0432\u0435\u0441\u044C \u0437\u0430\u0433\u0456\u043D (${p})`:""}.`),h.notes.push(`\u0427\u0435\u0440\u0435\u0437 ${m} ${m===1?"\u0434\u0435\u043D\u044C":"\u0434\u043D\u0456"} \u0432\u0430\u043C \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0442\u0435\u043A\u0442\u0438. \u0412\u0438 \u0434\u0456\u0441\u0442\u0430\u043B\u0438\u0441\u044F \u0434\u043E ${y.name}.`)}if(h.xp){n.addPlayerXp(h.xp);let f=o.troops.filter(m=>m.count-m.wounded>0),p=u*(e.outcome==="victory"?14:5),g=f.reduce((m,y)=>m+y.count,0);for(let m of f)$s(m,p*m.count/Math.max(1,g)*1)}r.renown+=h.renown,r.gold+=h.gold;for(let[f,p]of h.items){let g=xi-vi(r.inventory),m=Math.min(g,p);m>0&&An(r.inventory,f,m),m<p&&h.notes.push(`\u041D\u0435 \u0432\u0438\u0441\u0442\u0430\u0447\u0438\u043B\u043E \u043C\u0456\u0441\u0446\u044F \u0434\u043B\u044F \u0447\u0430\u0441\u0442\u0438\u043D\u0438 \u0437\u0434\u043E\u0431\u0438\u0447\u0456 (${wt[f].name}).`)}return r.kills+=h.kills,i.stats.killed+=d.killed+d.wounded,c&&(c.playerJoined=!1,n.endBattle(c)),h}function b0(s,t,e){let n=null,i=1/0;for(let r of s.state.settlements){let o=Ye(r.x,r.y,t,e);o<i&&(i=o,n=r)}return n}function Nh(s,t,e){if(!e)return;let n=t.x-e.x,i=t.y-e.y,r=Math.hypot(n,i)||1;for(let o of[30,20,10]){let a=t.x+n/r*o,l=t.y+i/r*o;if(s.nav.speedAt(a,l)>0){t.x=a,t.y=l;return}}}function Oh(s,t){return t.siege&&!t.siege.player?!1:(t.siege={faction:s.playerSide(),parties:[],start:s.state.time,player:!0},s.message(`\u0412\u0438 \u0432\u0437\u044F\u043B\u0438 \u0432 \u043E\u0431\u043B\u043E\u0433\u0443 ${t.name}.`,"war"),!0)}function Zr(s,t){return s.state.parties.filter(e=>e.inside===t.id&&!s.isHostile(e.faction,t.faction))}function Bh(s,t){let e=s.world,n=e.state,i=Zr(e,t),r=t.garrison.filter(a=>a.count-a.wounded>0).map(a=>({key:"garrison",troopId:a.id,count:a.count-a.wounded})),o={kind:"siege",terrain:kh(e,t.x,t.y),hour:n.time%24,sides:[{name:"\u0412\u0430\u0448\u0456 \u0441\u0438\u043B\u0438",units:Gi([n.party]),hero:Pa(e),companions:Uh(e),playerKey:"player"},{name:`\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D ${t.name}`,units:[...r,...Gi(i)],hero:null}],factionColors:[La(t.faction),He(t.faction).color],fortName:t.name};for(let a of i)a.held=!0;s.startBattle(o,a=>{for(let c of i)c.held=!1;let l=Ua(s,t,i,a);s.ui.showBattleResult(l)})}function Ua(s,t,e,n){let i=s.world,r=i.state,o={id:"garrison",x:t.x,y:t.y,troops:t.garrison,gold:t.kind==="town"?900:400,kind:"garrison",faction:t.faction,prisoners:[]},a=[o,...e],l=i.removeParty.bind(i);i.removeParty=(d,u)=>{d!==o&&l(d,u)};let c=i.flee.bind(i);i.flee=(d,u)=>{d!==o&&c(d,u)};let h;try{h=Na(s,{enemies:a,allies:[],mapBattle:null},n)}finally{i.removeParty=l,i.flee=c}if(n.outcome==="victory"){let d=t.faction;for(let f of e)i.pById.has(f.id)&&i.removeParty(f,!0);t.garrison=[],t.siege=null;let u=r.contract;if(u&&!u.vassal){let f=r.lords.filter(m=>m.faction===u.faction),p=lt.pick(f);i.captureSettlement(t,u.faction,p?p.id:null);let g=t.kind==="town"?1500:700;r.player.gold+=g,h.notes.push(`${t.name} \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u0442\u044C \u0434\u043E ${Ht[u.faction].name}. \u041D\u0430\u0433\u043E\u0440\u043E\u0434\u0430 \u0437\u0430 \u0448\u0442\u0443\u0440\u043C: ${g} \u0437\u043E\u043B\u043E\u0442\u0430.`),i.changeRelation(u.faction,6)}else u&&u.vassal?(i.captureSettlement(t,u.faction,"player"),h.notes.push(`${Ht[u.faction].king} \u0434\u0430\u0440\u0443\u0454 \u0432\u0430\u043C ${t.name} \u044F\u043A \u043B\u0435\u043D!`),i.changeRelation(u.faction,8)):(i.captureSettlement(t,"player","player"),h.notes.push(`${t.name} \u0442\u0435\u043F\u0435\u0440 \u043D\u0430\u043B\u0435\u0436\u0438\u0442\u044C \u0432\u0430\u043C! \u0417\u0430\u043B\u0438\u0448\u0442\u0435 \u0433\u0430\u0440\u043D\u0456\u0437\u043E\u043D, \u0449\u043E\u0431 \u0443\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F.`),Ht[d]&&(r.wars[Ke("player",d)]=!0,r.warSince[Ke("player",d)]=i.day));r.player.renown+=t.kind==="town"?40:25,i.message(`\u0412\u0438 \u0437\u0430\u0445\u043E\u043F\u0438\u043B\u0438 ${t.name}!`,"good")}else t.siege=null;return h}function zh(s,t){let e=s.world,n={kind:"arena",terrain:"arena",hour:13,sides:[{name:"\u0412\u0438",units:[],hero:Pa(e),playerKey:"player"},{name:"\u0411\u0456\u0439\u0446\u0456 \u0430\u0440\u0435\u043D\u0438",units:[],hero:null}],arenaFighters:7,factionColors:[La(t.faction),He(t.faction).color]};s.startBattle(n,i=>{let r=e.state.player,o=i.playerKills?.length||0,a=i.outcome==="victory",l=o*15+(a?150:0),c=o*30+(a?150:20);r.gold+=l,e.addPlayerXp(c),r.renown+=a?3:0;let h=[a?"\u0412\u0438 \u2014 \u043E\u0441\u0442\u0430\u043D\u043D\u0456\u0439, \u0445\u0442\u043E \u0441\u0442\u043E\u0457\u0442\u044C \u043D\u0430 \u043D\u043E\u0433\u0430\u0445! \u041D\u0430\u0442\u043E\u0432\u043F \u0448\u0430\u043B\u0435\u043D\u0456\u0454.":"\u0412\u0430\u0441 \u0437\u0431\u0438\u043B\u0438 \u0437 \u043D\u0456\u0433. \u0413\u043B\u044F\u0434\u0430\u0447\u0456 \u0441\u0432\u0438\u0441\u0442\u044F\u0442\u044C, \u0430\u043B\u0435 \u0446\u0435 \u043B\u0438\u0448\u0435 \u0442\u0440\u0435\u043D\u0443\u0432\u0430\u043D\u043D\u044F."];s.ui.showBattleResult({outcome:a?"arenaWin":"arenaLoss",playerLoss:{killed:{},wounded:{}},enemyLoss:{killed:{},wounded:{}},allyLoss:{killed:{},wounded:{}},gold:l,items:[],prisoners:{},xp:c,renown:a?3:0,kills:o,notes:h})})}function Hh(s,t){let e=s.state.party,n=de(e.troops),i=[];if(n>0){let r=Math.max(1,Math.round(n*lt.range(.1,.2))),o=[...e.troops].sort((l,c)=>Gt[l.id].tier-Gt[c.id].tier),a=r;for(let l of o){if(a<=0)break;let c=Math.min(a,l.count);Mn(e.troops,l.id,c,!0),i.push([l.id,c]),a-=c}}return e.graceUntil=s.state.time+4,Nh(s,e,t),i}function S0(s){return ke(s.state.party.troops)>0}var T0={town:"\u041C\u0456\u0441\u0442\u043E",castle:"\u0417\u0430\u043C\u043E\u043A",village:"\u0421\u0435\u043B\u043E"},E0=[0,25,60,120,210,330],A0=["\u041A\u0430\u0436\u0443\u0442\u044C, \u0441\u0442\u0435\u043F\u043E\u0432\u0456 \u0433\u0440\u0430\u0431\u0456\u0436\u043D\u0438\u043A\u0438 \u0442\u0440\u0438\u043C\u0430\u044E\u0442\u044C\u0441\u044F \u043F\u043E\u0434\u0430\u043B\u0456 \u0432\u0456\u0434 \u0433\u0456\u0440 \u2014 \u0457\u0445\u043D\u0456\u043C \u043A\u043E\u043D\u044F\u043C \u0442\u0430\u043C \u0432\u0430\u0436\u043A\u043E.","\u041A\u0443\u043F\u0446\u0456 \u0448\u0435\u043F\u043E\u0447\u0443\u0442\u044C: \u0441\u0456\u043B\u044C \u0443 \u043F\u0456\u0432\u043D\u0456\u0447\u043D\u0438\u0445 \u043C\u0456\u0441\u0442\u0430\u0445 \u0434\u043E\u0440\u043E\u0436\u0447\u0430, \u043D\u0456\u0436 \u0431\u0443\u0434\u044C-\u0434\u0435.","\u0414\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0456 \u0430\u0440\u0431\u0430\u043B\u0435\u0442\u043D\u0438\u043A\u0438 \u043B\u0435\u0433\u043A\u043E \u043F\u0440\u043E\u0431\u0438\u0432\u0430\u044E\u0442\u044C \u043D\u0430\u0432\u0456\u0442\u044C \u043A\u043E\u043B\u044C\u0447\u0443\u0433\u0443. \u0411\u0435\u0440\u0435\u0436\u0456\u0442\u044C\u0441\u044F \u0440\u043E\u0434\u0430\u043D\u0441\u044C\u043A\u0438\u0445 \u0441\u043D\u0430\u0439\u043F\u0435\u0440\u0456\u0432!","\u042F\u043A\u0449\u043E \u0443\u0434\u0430\u0440 \u043B\u0435\u0442\u0438\u0442\u044C \u0437\u043B\u0456\u0432\u0430 \u2014 \u0431\u043B\u043E\u043A\u0443\u0439\u0442\u0435 \u043B\u0456\u0432\u043E\u0440\u0443\u0447. \u0422\u0430\u043A \u043A\u0430\u0436\u0443\u0442\u044C \u0441\u0442\u0430\u0440\u0456 \u0432\u0435\u0442\u0435\u0440\u0430\u043D\u0438.","\u041B\u0438\u0446\u0430\u0440\u0456 \u0412\u0435\u043B\u044C\u043C\u0430\u0440\u0443 \u043D\u0438\u0449\u0456\u0432\u043D\u0456 \u0432 \u0430\u0442\u0430\u0446\u0456, \u0430\u043B\u0435 \u0432 \u0442\u0456\u0441\u043D\u043E\u043C\u0443 \u0431\u043E\u044E \u0457\u0445\u043D\u0456 \u043A\u043E\u043D\u0456 \u0432\u0440\u0430\u0437\u043B\u0438\u0432\u0456 \u0434\u043E \u0441\u043F\u0438\u0441\u0456\u0432.","\u0425\u0443\u0441\u043A\u0430\u0440\u043B\u0438 \u041D\u043E\u0440\u0434\u0433\u0435\u0439\u043C\u0443 \u0431\u2019\u044E\u0442\u044C\u0441\u044F \u044F\u043A \u0432\u0435\u0434\u043C\u0435\u0434\u0456. \u041A\u0440\u0430\u0449\u0435 \u0437\u0430\u0441\u0438\u043F\u0430\u0442\u0438 \u0457\u0445 \u0441\u0442\u0440\u0456\u043B\u0430\u043C\u0438 \u0437\u0434\u0430\u043B\u0435\u043A\u0443.","\u041A\u0456\u043D\u043D\u0456 \u043B\u0443\u0447\u043D\u0438\u043A\u0438 \u041A\u0430\u0433\u0430\u043D\u0430\u0442\u0443 \u043D\u0456\u043A\u043E\u043B\u0438 \u043D\u0435 \u043F\u0440\u0438\u0439\u043C\u0430\u044E\u0442\u044C \u0431\u043B\u0438\u0436\u043D\u044C\u043E\u0433\u043E \u0431\u043E\u044E \u2014 \u0442\u0440\u0438\u043C\u0430\u0439\u0442\u0435 \u0449\u0438\u0442 \u043D\u0430\u043F\u043E\u0433\u043E\u0442\u043E\u0432\u0456.","\u0425\u0442\u043E \u0432\u043E\u043B\u043E\u0434\u0456\u0454 \u0437\u0430\u043C\u043A\u043E\u043C, \u0442\u043E\u0439 \u043E\u0442\u0440\u0438\u043C\u0443\u0454 \u0449\u043E\u0442\u0438\u0436\u043D\u0435\u0432\u0438\u0439 \u043F\u0440\u0438\u0431\u0443\u0442\u043E\u043A. \u0410\u043B\u0435 \u0439 \u0437\u0430\u0445\u0438\u0449\u0430\u0442\u0438 \u0439\u043E\u0433\u043E \u0434\u043E\u0432\u0435\u0434\u0435\u0442\u044C\u0441\u044F.","\u0414\u043E\u0431\u0440\u0438\u0439 \u0445\u0456\u0440\u0443\u0440\u0433 \u0443 \u0437\u0430\u0433\u043E\u043D\u0456 \u0440\u044F\u0442\u0443\u0454 \u0436\u0438\u0442\u0442\u044F: \u043F\u043E\u0440\u0430\u043D\u0435\u043D\u0456 \u0432\u0438\u0436\u0438\u0432\u0430\u044E\u0442\u044C, \u0430 \u043D\u0435 \u0433\u0438\u043D\u0443\u0442\u044C.","\u041A\u0430\u0436\u0443\u0442\u044C, \u043D\u0430 \u0430\u0440\u0435\u043D\u0456 \u043C\u043E\u0436\u043D\u0430 \u0434\u043E\u0431\u0440\u0435 \u0437\u0430\u0440\u043E\u0431\u0438\u0442\u0438, \u044F\u043A\u0449\u043E \u0440\u0443\u043A\u0430 \u0442\u0432\u0435\u0440\u0434\u0430."],yf={openSettlement(s){let t=this.game,n=t.world.sById.get(s);if(!n)return;if(n.siege?.player){this.openSiegeCamp(n);return}n.visited=!0;let i,r=()=>{i&&this.windows.update(i,{title:n.name,body:this.settlementBody(n,r,()=>this.windows.close(i))})};i=this.windows.show({title:n.name,body:b("div"),cls:"wide",onClose:()=>t.onMenuClosed()}),r()},settlementBody(s,t,e){let n=this.game,i=n.world,r=i.state,o=He(s.faction),a=i.isHostile(s.faction,"player"),l=s.owner==="player"?"\u0432\u0438":s.owner?i.lById.get(s.owner)?.name:"\u043D\u0456\u0445\u0442\u043E",c=[];if(c.push(`${T0[s.kind]} ${s.name} \u2014 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F ${o.name}. \u0412\u043B\u0430\u0441\u043D\u0438\u043A: ${l}.`),s.kind==="village"){let u=i.sById.get(s.boundTo);c.push(`\u0421\u0435\u043B\u043E \u043D\u0430\u043B\u0435\u0436\u0438\u0442\u044C \u0434\u043E ${u?u.name:"\u2014"}. \u0421\u0435\u043B\u044F\u043D\u0438 \u0437\u0430\u0439\u043C\u0430\u044E\u0442\u044C\u0441\u044F \u0433\u043E\u0441\u043F\u043E\u0434\u0430\u0440\u0441\u0442\u0432\u043E\u043C${s.produces[0]?`, \u0442\u0443\u0442 \u0432\u0438\u0440\u043E\u0431\u043B\u044F\u044E\u0442\u044C ${wt[s.produces[0]].name.toLowerCase()}`:""}.`),c.push(`\u0414\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456\u0432, \u0433\u043E\u0442\u043E\u0432\u0438\u0445 \u0432\u0438\u0440\u0443\u0448\u0438\u0442\u0438 \u0437 \u0432\u0430\u043C\u0438: ${s.volunteers}.`)}else{c.push(`\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D: \u0431\u043B\u0438\u0437\u044C\u043A\u043E ${Math.round(de(s.garrison)/5)*5||de(s.garrison)} \u0432\u043E\u0457\u043D\u0456\u0432. \u041F\u0440\u043E\u0446\u0432\u0456\u0442\u0430\u043D\u043D\u044F: ${s.prosperity}.`);let u=r.parties.filter(f=>f.inside===s.id&&f.kind==="lord");u.length&&c.push(`\u0423 \u0441\u0442\u0456\u043D\u0430\u0445 \u043F\u0435\u0440\u0435\u0431\u0443\u0432\u0430\u044E\u0442\u044C: ${u.map(f=>i.lById.get(f.lordId)?.name).join(", ")}.`)}s.kind==="town"&&c.push(`
\u041C\u0456\u0441\u0446\u0435\u0432\u0456 \u0442\u043E\u0432\u0430\u0440\u0438: ${s.produces.map(u=>wt[u].name).join(", ")}. \u041F\u043E\u043F\u0438\u0442 \u043D\u0430: ${s.demands.map(u=>wt[u].name).join(", ")}.`),s.siege&&c.push(`
\u26A0 \u041C\u0456\u0441\u0442\u043E \u0432 \u043E\u0431\u043B\u043E\u0437\u0456 (${He(s.siege.faction).name})!`),a&&c.push(`
\u0412\u043E\u0440\u043E\u0442\u0430 \u0437\u0430\u0447\u0438\u043D\u0435\u043D\u0456 \u043F\u0435\u0440\u0435\u0434 \u0432\u0430\u043C\u0438: \u0446\u0435 \u0432\u043E\u0440\u043E\u0436\u0430 \u0442\u0435\u0440\u0438\u0442\u043E\u0440\u0456\u044F.`);let h=[];if(a){if(s.kind!=="village"&&h.push({label:"\u2694 \u0412\u0437\u044F\u0442\u0438 \u0432 \u043E\u0431\u043B\u043E\u0433\u0443",disabled:!!(s.siege&&!s.siege.player),title:s.siege?"\u041C\u0456\u0441\u0442\u043E \u0432\u0436\u0435 \u0432 \u043E\u0431\u043B\u043E\u0437\u0456":"",onClick:()=>{ke(r.party.troops)<3&&!confirm("\u0423 \u0432\u0430\u0441 \u0437\u0430\u043C\u0430\u043B\u043E \u0432\u043E\u0457\u043D\u0456\u0432 \u0434\u043B\u044F \u043E\u0431\u043B\u043E\u0433\u0438. \u0412\u0441\u0435 \u043E\u0434\u043D\u043E \u0440\u043E\u0437\u043F\u043E\u0447\u0430\u0442\u0438?")||(Oh(i,s),e(),this.openSiegeCamp(s))}}),r.wars[Ke("player",s.faction)]&&Ht[s.faction]){let u=this.peaceCost(s.faction);h.push({label:"\u2709 \u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u043F\u043E\u0441\u043B\u0430\u043D\u0446\u044F \u0437 \u043C\u0438\u0440\u043E\u043C",hint:`${u} \u0437\u043E\u043B.`,disabled:r.player.gold<u,onClick:()=>{this.makePeace(s.faction),t()}})}}else{if(s.kind==="town"){h.push({label:"\u2696 \u0420\u0438\u043D\u043E\u043A: \u0442\u043E\u0432\u0430\u0440\u0438 \u0456 \u043F\u0440\u043E\u0432\u0456\u0437\u0456\u044F",onClick:()=>this.openMarket(s,t)}),h.push({label:"\u2692 \u0417\u0431\u0440\u043E\u044F\u0440 \u0456 \u043A\u043E\u043B\u044C\u0447\u0443\u0436\u043D\u0438\u043A",onClick:()=>this.openShop(s,t)}),h.push({label:"\u{1F37A} \u0422\u0430\u0432\u0435\u0440\u043D\u0430",onClick:()=>this.openTavern(s,t)}),h.push({label:"\u2694 \u0410\u0440\u0435\u043D\u0430",hint:"\u0442\u0440\u0435\u043D\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u0439 \u0431\u0456\u0439",disabled:r.player.hp<20,title:r.player.hp<20?"\u0412\u0438 \u043D\u0430\u0434\u0442\u043E \u043F\u043E\u0440\u0430\u043D\u0435\u043D\u0456":"",onClick:()=>{e(),zh(n,s)}});let u=Rh(i,s.id);h.push({label:"\u{1F4DC} \u0426\u0435\u0445\u043E\u0432\u0438\u0439 \u043C\u0430\u0439\u0441\u0442\u0435\u0440 (\u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F)",hint:u.length?`${u.length}`:"",onClick:()=>this.openQuestBoard(s,t)})}s.kind==="village"&&(h.push({label:"\u2691 \u041D\u0430\u0431\u0440\u0430\u0442\u0438 \u0434\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456\u0432",hint:`${s.volunteers}`,onClick:()=>this.openRecruit(s,t)}),h.push({label:"\u2696 \u041A\u0443\u043F\u0438\u0442\u0438 \u043F\u0440\u043E\u0432\u0456\u0437\u0456\u044E",onClick:()=>this.openMarket(s,t,!0)}));for(let u of hf(i,s.id))h.push({label:`\u{1F4E6} \u0414\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0432\u0430\u043D\u0442\u0430\u0436 (${u.title})`,cls:"primary",onClick:()=>{df(i,u),t()}});s.kind!=="village"&&(h.push({label:"\u265B \u0422\u0440\u043E\u043D\u043D\u0430 \u0437\u0430\u043B\u0430",onClick:()=>this.openHall(s,t)}),s.owner==="player"&&h.push({label:"\u26E8 \u041A\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u0433\u0430\u0440\u043D\u0456\u0437\u043E\u043D\u043E\u043C",onClick:()=>this.openGarrison(s,t)})),h.push({label:"\u263E \u0412\u0456\u0434\u043F\u043E\u0447\u0438\u0442\u0438 \u0434\u043E \u0440\u0430\u043D\u043A\u0443",hint:"\u043B\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F",disabled:!!s.siege,onClick:()=>this.restIn(s,t)})}h.push({label:"\u2190 \u041F\u043E\u043A\u0438\u043D\u0443\u0442\u0438",onClick:e});let d=s.kind;return Ks({text:c.join(`
`),scene:ms(d,o.color,r.time%24),options:h})},async restIn(s,t){let e=this.game,n=e.world,i=n.state.time%24,r=i<7?7-i:31-i;n.state.party.graceUntil=n.state.time+r+.5,await e.waitHours(r,{heal:!0}),n.state.party.moraleBoost+=2,t()},peaceCost(s){let t=this.game.world.state;return 400+t.player.renown*3+Math.max(0,-t.factions[s].relation)*10},makePeace(s){let t=this.game.world,e=t.state,n=this.peaceCost(s);e.player.gold<n||(e.player.gold-=n,delete e.wars[Ke("player",s)],e.warSince[Ke("player",s)]=t.day,e.factions[s].relation=Math.max(0,e.factions[s].relation),t.message(`${Ht[s].name} \u043F\u0440\u0438\u0439\u043C\u0430\u0454 \u0432\u0430\u0448\u0456 \u0434\u0430\u0440\u0438 \u0456 \u043F\u043E\u0433\u043E\u0434\u0436\u0443\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u043C\u0438\u0440.`,"good"))},openMarket(s,t,e=!1){let i=this.game.world.state,r=i.player,o,a=()=>{let l=e?Bi:[...Bi,...ds],c=b("table",{class:"list"},b("tr",null,b("th",null,"\u0422\u043E\u0432\u0430\u0440"),b("th",null,""),b("th",{class:"num"},"\u0423 \u0432\u0430\u0441"),b("th",{class:"num"},"\u041A\u0443\u043F\u0456\u0432\u043B\u044F"),b("th",{class:"num"},"\u041F\u0440\u043E\u0434\u0430\u0436"),b("th",null,"")));for(let d of l){let u=wt[d],f=qs(r.inventory,d),p=Sh(i,s,d),g=Th(i,s,d),m=s.market[d]??1,y=m<.8?b("span",{class:"pill",style:{background:"#3f7a3a"}},"\u0434\u0435\u0448\u0435\u0432\u043E"):m>1.25?b("span",{class:"pill",style:{background:"#a8322a"}},"\u043F\u043E\u043F\u0438\u0442"):null,x=vi(r.inventory)>=xi;c.append(b("tr",null,b("td",null,u.name," ",b("span",{class:"muted",style:{fontSize:"12px"}},us(u))),b("td",null,y),b("td",{class:"num"},f||""),b("td",{class:"num gold"},p),b("td",{class:"num"},g),b("td",{class:"num"},bt("\u041A\u0443\u043F\u0438\u0442\u0438",()=>{r.gold>=p&&!x&&(r.gold-=p,An(r.inventory,d,1),Eh(s,d,!0),a())},"small",{disabled:r.gold<p||x})," ",bt("\u041F\u0440\u043E\u0434\u0430\u0442\u0438",()=>{Xn(r.inventory,d,1)&&(r.gold+=g,Eh(s,d,!1),a())},"small",{disabled:!f}))))}let h=b("div",null,b("p",null,"\u0417\u043E\u043B\u043E\u0442\u043E: ",b("b",{class:"gold"},r.gold),` \xB7 \u0412\u0430\u043D\u0442\u0430\u0436: ${vi(r.inventory)} / ${xi}`,e?null:b("span",{class:"muted"}," \xB7 \u0426\u0456\u043D\u0438 \u0437\u043C\u0456\u043D\u044E\u044E\u0442\u044C\u0441\u044F, \u043A\u043E\u043B\u0438 \u0432\u0438 \u043A\u0443\u043F\u0443\u0454\u0442\u0435 \u0430\u0431\u043E \u043F\u0440\u043E\u0434\u0430\u0454\u0442\u0435 \u0431\u0430\u0433\u0430\u0442\u043E \u043E\u0434\u043D\u043E\u0433\u043E \u0442\u043E\u0432\u0430\u0440\u0443.")),c);o?this.windows.update(o,{body:h}):o=this.windows.show({title:e?`\u041F\u0440\u043E\u0432\u0456\u0437\u0456\u044F \u2014 ${s.name}`:`\u0420\u0438\u043D\u043E\u043A \u2014 ${s.name}`,body:h,onClose:t,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(o),"primary")]})};a()},openShop(s,t){let n=this.game.world.state,i=n.player,r,o=()=>{let a=b("table",{class:"list"},b("tr",null,b("th",null,"\u0422\u043E\u0432\u0430\u0440"),b("th",{class:"num"},"\u0426\u0456\u043D\u0430"),b("th",null,""))),l=[...s.shop].sort((u,f)=>wt[u].type.localeCompare(wt[f].type)||wt[u].price-wt[f].price);for(let u of l){let f=wt[u],p=Sh(n,s,u),g=vi(i.inventory)>=xi;a.append(b("tr",null,b("td",null,b("b",null,f.name),b("div",{class:"muted",style:{fontSize:"12.5px"}},us(f))),b("td",{class:"num gold"},p),b("td",{class:"num"},bt("\u041A\u0443\u043F\u0438\u0442\u0438",()=>{i.gold<p||g||(i.gold-=p,An(i.inventory,u,1),o())},"small",{disabled:i.gold<p||g}))))}let c=b("table",{class:"list"},b("tr",null,b("th",null,"\u0412\u0430\u0448\u0456 \u0440\u0435\u0447\u0456"),b("th",{class:"num"},"\u0426\u0456\u043D\u0430"),b("th",null,""))),h=i.inventory.filter(u=>Hs(u.id));for(let u of h){let f=wt[u.id],p=Th(n,s,u.id);c.append(b("tr",null,b("td",null,b("b",null,f.name),u.qty>1?` \xD7${u.qty}`:"",b("div",{class:"muted",style:{fontSize:"12.5px"}},us(f))),b("td",{class:"num"},p),b("td",{class:"num"},bt("\u041F\u0440\u043E\u0434\u0430\u0442\u0438",()=>{Xn(i.inventory,u.id,1),i.gold+=p,o()},"small"))))}h.length||c.append(b("tr",null,b("td",{colSpan:3,class:"muted"},"\u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0439\u0432\u043E\u0433\u043E \u0441\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F. \u0422\u0440\u043E\u0444\u0435\u0457 \u0437 \u0431\u043E\u0457\u0432 \u0437\u2019\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u0442\u0443\u0442.")));let d=b("div",null,b("p",null,"\u0417\u043E\u043B\u043E\u0442\u043E: ",b("b",{class:"gold"},i.gold)," \xB7 \u041A\u0443\u043F\u043B\u0435\u043D\u0435 \u043F\u043E\u0442\u0440\u0430\u043F\u043B\u044F\u0454 \u0434\u043E \u0456\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044F \u2014 \u0432\u0434\u044F\u0433\u043D\u0456\u0442\u044C \u0439\u043E\u0433\u043E \u0443 \u0432\u0456\u043A\u043D\u0456 \u0441\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F (I)."),b("div",{class:"cols"},b("div",null,b("div",{class:"section-title"},"\u041F\u0440\u043E\u0434\u0430\u0454\u0442\u044C\u0441\u044F"),a),b("div",null,b("div",{class:"section-title"},"\u041F\u0440\u043E\u0434\u0430\u0442\u0438"),c)));r?this.windows.update(r,{body:d}):r=this.windows.show({title:`\u0417\u0431\u0440\u043E\u044F\u0440 \u2014 ${s.name}`,body:d,cls:"wide",onClose:t,footer:[bt("\u0421\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F\u2026",()=>this.openInventory(o)),bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(r),"primary")]})};o()},openTavern(s,t){let e=this.game.world,n=e.state,i=n.player,r,o=lt.pick(A0),a=()=>{let l=[];if(l.push(b("p",{style:{fontStyle:"italic"}},`\u0423 \u043A\u0443\u0442\u043A\u0443 \u0441\u0442\u0430\u0440\u0438\u0439 \u0432\u0435\u0442\u0435\u0440\u0430\u043D \u0431\u0443\u0440\u043C\u043E\u0447\u0435: \xAB${o}\xBB`)),l.push(b("div",{class:"section-title"},"\u041D\u0430\u0439\u043C\u0430\u043D\u0446\u0456")),s.tavern&&s.tavern.count>0){let u=Gt[s.tavern.merc],f=E0[u.tier],p=e.partySpace(),g=Math.max(0,Math.min(s.tavern.count,p,Math.floor(i.gold/f)));l.push(b("p",null,`\u0417\u0430\u0433\u0456\u043D \u043D\u0430\u0439\u043C\u0430\u043D\u0446\u0456\u0432 \u0448\u0443\u043A\u0430\u0454 \u0440\u043E\u0431\u043E\u0442\u0443: ${u.name} \xD7${s.tavern.count} (${Vr[u.type]}, \u0440\u0456\u0432\u0435\u043D\u044C ${u.tier}). \u0426\u0456\u043D\u0430: ${f} \u0437\u043E\u043B\u043E\u0442\u0430 \u0437\u0430 \u043A\u043E\u0436\u043D\u043E\u0433\u043E, \u043F\u043B\u0430\u0442\u043D\u044F ${u.wage}/\u0442\u0438\u0436\u0434\u0435\u043D\u044C.`)),l.push(b("div",null,bt(`\u041D\u0430\u0439\u043D\u044F\u0442\u0438 ${g} \u0437\u0430 ${g*f} \u0437\u043E\u043B.`,()=>{i.gold-=g*f,we(n.party.troops,u.id,g),s.tavern.count-=g,e.message(`\u0414\u043E \u0437\u0430\u0433\u043E\u043D\u0443 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u043B\u0438\u0441\u044F \u043D\u0430\u0439\u043C\u0430\u043D\u0446\u0456: ${u.name} \xD7${g}.`,"good"),a()},"primary",{disabled:g<=0}),p<=0?b("span",{class:"bad"}," \u0417\u0430\u0433\u0456\u043D \u043F\u0435\u0440\u0435\u043F\u043E\u0432\u043D\u0435\u043D\u0438\u0439."):null))}else l.push(b("p",{class:"muted"},"\u041D\u0430\u0439\u043C\u0430\u043D\u0446\u0456\u0432 \u0437\u0430\u0440\u0430\u0437 \u043D\u0435\u043C\u0430\u0454. \u0417\u0430\u0433\u043B\u044F\u043D\u044C\u0442\u0435 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0442\u0438\u0436\u043D\u044F."));let c=Object.entries(n.companions||{}).filter(([,u])=>!u.hired&&u.location===s.id);for(let[u,f]of c){let p=ri[u],g=Object.entries(p.skills).map(([m,y])=>`${zi[m].name} ${y}`).join(", ");l.push(b("div",{class:"section-title"},"\u041C\u0430\u043D\u0434\u0440\u0456\u0432\u043D\u0438\u0439 \u0433\u0435\u0440\u043E\u0439")),l.push(b("div",{class:"slot"},b("div",{class:"item-name"},`${p.name} \u2014 \u0440\u0456\u0432\u0435\u043D\u044C ${p.level}`),b("p",{style:{margin:"4px 0"}},`\xAB${p.story}\xBB`),b("div",{class:"item-desc"},`\u041D\u0430\u0432\u0438\u0447\u043A\u0438: ${g}. \u041F\u043B\u0430\u0442\u043D\u044F ${Ws(p)}/\u0442\u0438\u0436\u0434\u0435\u043D\u044C.`),bt(`\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0438 \u0434\u043E \u0437\u0430\u0433\u043E\u043D\u0443 (${p.cost} \u0437\u043E\u043B.)`,()=>{i.gold<p.cost||e.isPlayerFull()||(i.gold-=p.cost,f.hired=!0,f.location=null,e.message(`${p.name} \u043F\u0440\u0438\u0454\u0434\u043D\u0443\u0454\u0442\u044C\u0441\u044F \u0434\u043E \u0432\u0430\u0448\u043E\u0433\u043E \u0437\u0430\u0433\u043E\u043D\u0443!`,"good"),a())},"primary small",{disabled:i.gold<p.cost||e.isPlayerFull(),title:e.isPlayerFull()?"\u0417\u0430\u0433\u0456\u043D \u043F\u0435\u0440\u0435\u043F\u043E\u0432\u043D\u0435\u043D\u0438\u0439":""})))}if(l.push(b("div",{class:"section-title"},"\u041F\u043E\u0441\u0435\u0440\u0435\u0434\u043D\u0438\u043A \u0432\u0438\u043A\u0443\u043F\u0443")),n.party.prisoners.length){let u=b("table",{class:"list"}),f=0;for(let p of n.party.prisoners){let g=lf(n,p.id);f+=g*p.count,u.append(b("tr",null,b("td",null,Gt[p.id].name),b("td",{class:"num"},`\xD7${p.count}`),b("td",{class:"num gold"},`${g}`),b("td",{class:"num"},bt("\u041F\u0440\u043E\u0434\u0430\u0442\u0438",()=>{i.gold+=g*p.count,n.party.prisoners.splice(n.party.prisoners.indexOf(p),1),a()},"small"))))}l.push(u,b("div",{style:{marginTop:"6px"}},bt(`\u041F\u0440\u043E\u0434\u0430\u0442\u0438 \u0432\u0441\u0456\u0445 \u0437\u0430 ${f} \u0437\u043E\u043B.`,()=>{i.gold+=f,n.party.prisoners=[],a()},"primary")))}else l.push(b("p",{class:"muted"},"\xAB\u041F\u0440\u0438\u0432\u0435\u0434\u0438 \u043C\u0435\u043D\u0456 \u043F\u043E\u043B\u043E\u043D\u0435\u043D\u0438\u0445 \u2014 \u0456 \u044F \u0437\u0430\u043F\u043B\u0430\u0447\u0443 \u0434\u043E\u0431\u0440\u0438\u043C \u0441\u0440\u0456\u0431\u043B\u043E\u043C.\xBB"));let h=10+de(n.party.troops)*2;l.push(b("div",{class:"section-title"},"\u041A\u043E\u0440\u0447\u043C\u0430")),l.push(bt(`\u041F\u0440\u0438\u0433\u043E\u0441\u0442\u0438\u0442\u0438 \u0437\u0430\u0433\u0456\u043D (${h} \u0437\u043E\u043B., +\u043C\u043E\u0440\u0430\u043B\u044C)`,()=>{i.gold-=h,n.party.moraleBoost+=8,e.message("\u0417\u0430\u0433\u0456\u043D \u0433\u0443\u0447\u043D\u043E \u0441\u0432\u044F\u0442\u043A\u0443\u0454. \u0411\u043E\u0439\u043E\u0432\u0438\u0439 \u0434\u0443\u0445 \u0437\u0440\u043E\u0441\u0442\u0430\u0454!","good"),a()},"",{disabled:i.gold<h}));let d=b("div",null,b("p",null,"\u0417\u043E\u043B\u043E\u0442\u043E: ",b("b",{class:"gold"},i.gold)),...l);r?this.windows.update(r,{body:d}):r=this.windows.show({title:`\u0422\u0430\u0432\u0435\u0440\u043D\u0430 \u2014 ${s.name}`,body:d,onClose:t,footer:[bt("\u0412\u0438\u0439\u0442\u0438",()=>this.windows.close(r),"primary")]})};a()},openRecruit(s,t){let e=this.game.world,n=e.state,i=n.player,r=Gt[Yu[s.culture]||"velmar_recruit"],o=10,a,l=()=>{let c=Ht[s.faction]?n.factions[s.faction].relation:0,h=e.partySpace(),d=Math.max(0,Math.min(s.volunteers,h,Math.floor(i.gold/o))),u=[];c<-5&&s.owner!=="player"?u.push(b("p",{class:"bad"},"\u0421\u0435\u043B\u044F\u043D\u0438 \u043D\u0435 \u0434\u043E\u0432\u0456\u0440\u044F\u044E\u0442\u044C \u0432\u0430\u043C \u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u043B\u044F\u044E\u0442\u044C\u0441\u044F \u0439\u0442\u0438 \u0434\u043E \u0437\u0430\u0433\u043E\u043D\u0443.")):(u.push(b("p",null,`${s.volunteers} ${Fi(s.volunteers,"\u0441\u0435\u043B\u044F\u043D\u0438\u043D \u0433\u043E\u0442\u043E\u0432\u0438\u0439","\u0441\u0435\u043B\u044F\u043D\u0438 \u0433\u043E\u0442\u043E\u0432\u0456","\u0441\u0435\u043B\u044F\u043D \u0433\u043E\u0442\u043E\u0432\u0456")} \u0441\u0442\u0430\u0442\u0438 \u043F\u0456\u0434 \u0432\u0430\u0448 \u043F\u0440\u0430\u043F\u043E\u0440 \u044F\u043A \xAB${r.name}\xBB. \u0421\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F \u043A\u043E\u0448\u0442\u0443\u0454 ${o} \u0437\u043E\u043B\u043E\u0442\u0430 \u043D\u0430 \u043A\u043E\u0436\u043D\u043E\u0433\u043E.`)),u.push(b("p",{class:"muted"},`\u041C\u0456\u0441\u0446\u0435 \u0432 \u0437\u0430\u0433\u043E\u043D\u0456: ${Math.max(0,h)}. \u041D\u043E\u0432\u043E\u0431\u0440\u0430\u043D\u0446\u0456 \u0437 \u0447\u0430\u0441\u043E\u043C \u0441\u0442\u0430\u044E\u0442\u044C \u0434\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u043C\u0438 \u0432\u043E\u0457\u043D\u0430\u043C\u0438 ${Ht[s.culture]?.name||""}.`)),u.push(bt(`\u041D\u0430\u0431\u0440\u0430\u0442\u0438 ${d} (${d*o} \u0437\u043E\u043B.)`,()=>{i.gold-=d*o,we(n.party.troops,r.id,d),s.volunteers-=d,e.message(`\u0414\u043E \u0437\u0430\u0433\u043E\u043D\u0443 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u043B\u0438\u0441\u044F ${d} \u043D\u043E\u0432\u043E\u0431\u0440\u0430\u043D\u0446\u0456\u0432.`,"good"),l()},"primary",{disabled:d<=0})));let f=b("div",null,...u);a?this.windows.update(a,{body:f}):a=this.windows.show({title:`\u0414\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456 \u2014 ${s.name}`,body:f,cls:"narrow",onClose:t,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(a))]})};l()},openQuestBoard(s,t){let e=this.game.world,n,i=()=>{let r=Rh(e,s.id),o=b("div",null);r.length||o.append(b("p",{class:"muted"},"\xAB\u0414\u043B\u044F \u0432\u0430\u0441 \u0440\u043E\u0431\u043E\u0442\u0438 \u043F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454. \u0417\u0430\u0445\u043E\u0434\u044C\u0442\u0435 \u0437\u0433\u043E\u0434\u043E\u043C.\xBB"));for(let a of r)o.append(b("div",{class:"slot",style:{marginBottom:"8px"}},b("div",{class:"item-name"},a.title),b("p",null,a.desc),b("div",null,"\u041D\u0430\u0433\u043E\u0440\u043E\u0434\u0430: ",b("b",{class:"gold"},`${a.reward} \u0437\u043E\u043B\u043E\u0442\u0430`),` \xB7 \u0422\u0435\u0440\u043C\u0456\u043D: ${a.days} \u0434\u043D\u0456\u0432 `,bt("\u0412\u0437\u044F\u0442\u0438\u0441\u044F",()=>{let l=cf(e,a);l&&this.toast(l),i()},"small primary"))));n?this.windows.update(n,{body:o}):n=this.windows.show({title:`\u0426\u0435\u0445\u043E\u0432\u0438\u0439 \u043C\u0430\u0439\u0441\u0442\u0435\u0440 \u2014 ${s.name}`,body:o,cls:"narrow",onClose:t,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(n))]})};i()},openHall(s,t){let e=this.game.world,n=e.state,i=n.player,r=s.faction,o=He(r),a,l=()=>{let c=b("div",null);if(r==="player")c.append(b("p",null,"\u0426\u0435 \u0432\u0430\u0448\u0430 \u0432\u043B\u0430\u0441\u043D\u0430 \u0437\u0430\u043B\u0430. \u0421\u043B\u0443\u0433\u0438 \u0441\u0445\u0438\u043B\u044F\u044E\u0442\u044C\u0441\u044F, \u043A\u043E\u043B\u0438 \u0432\u0438 \u0432\u0445\u043E\u0434\u0438\u0442\u0435."));else{let h=Ht[r],d=Math.round(n.factions[r].relation),u=s.owner==="player"?"\u0432\u0438":e.lById.get(s.owner)?.name||h.king;c.append(b("p",null,Yr(h.color),b("b",null,h.name),` \u2014 ${h.desc}`)),c.append(b("p",null,`\u0413\u043E\u0441\u043F\u043E\u0434\u0430\u0440 \u0437\u0430\u043B\u0438: ${u}. \u041F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044C: ${h.king}. \u0412\u0430\u0448\u0456 \u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0438: `,b("b",{class:d>=0?"good":"bad"},d),"."));let f=Object.keys(Ht).filter(g=>g!==r&&e.atWar(r,g)).map(g=>Ht[g].name);c.append(b("p",null,`\u0412\u043E\u044E\u0454 \u0437: ${f.length?f.join(", "):"\u043D\u0456 \u0437 \u043A\u0438\u043C"}.`));let p=n.contract;if(p)if(p.faction===r)if(c.append(b("div",{class:"section-title"},"\u0421\u043B\u0443\u0436\u0431\u0430")),p.vassal)c.append(b("p",null,`\u0412\u0438 \u2014 \u0432\u0430\u0441\u0430\u043B ${h.name}. \u0417\u0430\u0445\u043E\u043F\u043B\u0435\u043D\u0456 \u0432\u0430\u043C\u0438 \u0437\u0430\u043C\u043A\u0438 \u0442\u0430 \u043C\u0456\u0441\u0442\u0430 \u0441\u0442\u0430\u044E\u0442\u044C \u0432\u0430\u0448\u0438\u043C\u0438 \u043B\u0435\u043D\u0430\u043C\u0438.`));else{c.append(b("p",null,`\u0412\u0430\u0448 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u0434\u0456\u0454 \u0434\u043E \u0434\u043D\u044F ${p.until}.`)),c.append(bt("\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u043D\u0430 30 \u0434\u043D\u0456\u0432",()=>{p.until=Math.max(p.until,e.day)+30,l()}));let g=i.renown>=100&&d>=5;c.append(" "),c.append(bt("\u041F\u0440\u0438\u0441\u044F\u0433\u043D\u0443\u0442\u0438 \u043D\u0430 \u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C (\u0441\u0442\u0430\u0442\u0438 \u0432\u0430\u0441\u0430\u043B\u043E\u043C)",()=>{p.vassal=!0;let m=n.settlements.find(y=>y.kind==="village"&&y.faction===r&&y.owner!=="player");m&&(m.owner="player",e.message(`${h.king} \u043F\u0440\u0438\u0439\u043C\u0430\u0454 \u0432\u0430\u0448\u0443 \u043F\u0440\u0438\u0441\u044F\u0433\u0443 \u0456 \u0434\u0430\u0440\u0443\u0454 \u0432\u0430\u043C \u0441\u0435\u043B\u043E ${m.name}!`,"good")),e.changeRelation(r,10),l()},"primary",{disabled:!g,title:g?"":"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u043E: \u0441\u043B\u0430\u0432\u0430 100 \u0456 \u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0438 5"})),g||c.append(b("p",{class:"muted"},`\u0429\u043E\u0431 \u0441\u0442\u0430\u0442\u0438 \u0432\u0430\u0441\u0430\u043B\u043E\u043C, \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u0441\u043B\u0430\u0432\u0430 100 (\u0443 \u0432\u0430\u0441 ${i.renown}) \u0456 \u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0438 5.`))}else c.append(b("p",{class:"muted"},`\u0412\u0438 \u0441\u043B\u0443\u0436\u0438\u0442\u0435 ${Ht[p.faction].name}. \u0422\u0443\u0442 \u0432\u0430\u043C \u043D\u0456\u0447\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u043F\u043E\u043D\u0443\u0432\u0430\u0442\u0438.`));else{let g=e.contractPay();c.append(b("div",{class:"section-title"},"\u0421\u043B\u0443\u0436\u0431\u0430")),c.append(b("p",null,`\xAB\u041D\u0430\u043C \u0437\u0430\u0432\u0436\u0434\u0438 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0456 \u043C\u0435\u0447\u0456. ${h.king} \u043F\u043B\u0430\u0442\u0438\u0442\u0438\u043C\u0435 ${g} \u0437\u043E\u043B\u043E\u0442\u0430 \u0449\u043E\u0442\u0438\u0436\u043D\u044F \u0437\u0430 \u0432\u0430\u0448\u0443 \u0441\u043B\u0443\u0436\u0431\u0443 \u0432\u043F\u0440\u043E\u0434\u043E\u0432\u0436 30 \u0434\u043D\u0456\u0432.\xBB \u0412\u0438 \u0432\u043E\u044E\u0432\u0430\u0442\u0438\u043C\u0435\u0442\u0435 \u0437 \u0432\u043E\u0440\u043E\u0433\u0430\u043C\u0438 ${h.short}.`)),c.append(bt("\u0423\u043A\u043B\u0430\u0441\u0442\u0438 \u043D\u0430\u0439\u043C\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442",()=>{n.contract={faction:r,until:e.day+30,vassal:!1},e.message(`\u0412\u0438 \u0441\u0442\u0430\u043B\u0438 \u043D\u0430\u0439\u043C\u0430\u043D\u0446\u0435\u043C ${h.name}.`,"good"),e.changeRelation(r,3),l()},"primary",{disabled:d<-5}))}}a?this.windows.update(a,{body:c}):a=this.windows.show({title:`\u0422\u0440\u043E\u043D\u043D\u0430 \u0437\u0430\u043B\u0430 \u2014 ${s.name}`,body:c,onClose:t,footer:[bt("\u0412\u0438\u0439\u0442\u0438",()=>this.windows.close(a))]})};l()},openGarrison(s,t){let e=this.game.world,n=e.state,i,r=()=>{let o=(c,h,d,u)=>{let f=b("table",{class:"list"},b("tr",null,b("th",null,c),b("th",{class:"num"},"\u041A-\u0441\u0442\u044C"),b("th",null,"")));for(let p of h){let g=p.count-p.wounded;f.append(b("tr",null,b("td",null,Gt[p.id].name),b("td",{class:"num"},p.count,p.wounded?` (${p.wounded} \u043F\u043E\u0440.)`:""),b("td",{class:"num"},bt(u,()=>{a(h,d,p.id,1)},"small",{disabled:g<=0||d===n.party.troops&&e.isPlayerFull()})," ",bt(`${u}${u}`,()=>{a(h,d,p.id,g)},"small",{disabled:g<=0||d===n.party.troops&&e.isPlayerFull()}))))}return h.length||f.append(b("tr",null,b("td",{colSpan:3,class:"muted"},"\u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E"))),f},a=(c,h,d,u)=>{h===n.party.troops&&(u=Math.min(u,e.partySpace()));let f=Mn(c,d,u,!1);we(h,d,f),r()},l=b("div",null,b("p",{class:"muted"},"\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D \u0437\u0430\u0445\u0438\u0449\u0430\u0454 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F \u043F\u0456\u0434 \u0447\u0430\u0441 \u043E\u0431\u043B\u043E\u0433\u0438. \u041F\u043B\u0430\u0442\u043D\u044F \u0433\u0430\u0440\u043D\u0456\u0437\u043E\u043D\u0443 \u2014 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0437\u0432\u0438\u0447\u0430\u0439\u043D\u043E\u0457."),b("div",{class:"cols"},b("div",null,o("\u0412\u0430\u0448 \u0437\u0430\u0433\u0456\u043D",n.party.troops,s.garrison,"\u2192")),b("div",null,o("\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D",s.garrison,n.party.troops,"\u2190"))));i?this.windows.update(i,{body:l}):i=this.windows.show({title:`\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D \u2014 ${s.name}`,body:l,cls:"wide",onClose:t,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(i),"primary")]})};r()},openSiegeCamp(s){let t=this.game,e=t.world,n=e.state,i,r=()=>this.windows.close(i),o=()=>{if(!s.siege||!s.siege.player){r();return}let a=Math.min(Ea*.66,n.time-s.siege.start),l=Ea*.66,c=a>=l-1e-6,h=Zr(e,s),d=ke(s.garrison)+h.reduce((g,m)=>g+ke(m.troops),0),u=[`\u0412\u0438 \u043E\u0431\u043B\u044F\u0433\u0430\u0454\u0442\u0435 ${s.name} (${He(s.faction).name}).`,`\u0417\u0430\u0445\u0438\u0441\u043D\u0438\u043A\u0456\u0432: \u0431\u043B\u0438\u0437\u044C\u043A\u043E ${d}. ${h.length?`\u0423 \u0441\u0442\u0456\u043D\u0430\u0445: ${h.map(g=>g.name).join(", ")}.`:""}`,`\u0412\u0430\u0448\u0438\u0445 \u0432\u043E\u0457\u043D\u0456\u0432, \u0437\u0434\u0430\u0442\u043D\u0438\u0445 \u0434\u043E \u0431\u043E\u044E: ${ke(n.party.troops)}.`,c?`
\u0414\u0440\u0430\u0431\u0438\u043D\u0438 \u0442\u0430 \u043E\u0431\u043B\u043E\u0433\u043E\u0432\u0430 \u0440\u0430\u043C\u043F\u0430 \u0433\u043E\u0442\u043E\u0432\u0456. \u041C\u043E\u0436\u043D\u0430 \u0448\u0442\u0443\u0440\u043C\u0443\u0432\u0430\u0442\u0438!`:`
\u041F\u0456\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0434\u043E \u0448\u0442\u0443\u0440\u043C\u0443: ${Math.floor(a)} / ${Math.ceil(l)} \u0433\u043E\u0434\u0438\u043D.`,`
\u041E\u0431\u0435\u0440\u0435\u0436\u043D\u043E: \u0432\u043E\u0440\u043E\u0436\u0435 \u0432\u0456\u0439\u0441\u044C\u043A\u043E \u043C\u043E\u0436\u0435 \u043F\u0440\u0438\u0439\u0442\u0438 \u043D\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u0443 \u043E\u0431\u043B\u043E\u0436\u0435\u043D\u0438\u043C.`].join(`
`),f=[{label:"\u2694 \u0428\u0442\u0443\u0440\u043C\u0443\u0432\u0430\u0442\u0438 \u0441\u0442\u0456\u043D\u0438!",cls:"primary",disabled:!c,onClick:()=>{r(),Bh(t,s)}},{label:"\u2691 \u0414\u043E\u0440\u0443\u0447\u0438\u0442\u0438 \u0448\u0442\u0443\u0440\u043C \u0437\u0430\u0433\u043E\u043D\u0443",disabled:!c||ke(n.party.troops)===0,onClick:()=>{r(),this.autoAssault(s)}},{label:"\u23F3 \u0427\u0435\u043A\u0430\u0442\u0438 \u043F\u0456\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438",disabled:c,onClick:async()=>{let g=await t.waitHours(Math.max(.5,l-a),{stopOnEvent:!0});g?(r(),t.handleWorldEvent(g)):o()}},{label:"\u2715 \u0417\u043D\u044F\u0442\u0438 \u043E\u0431\u043B\u043E\u0433\u0443",onClick:()=>{s.siege=null,e.message(`\u0412\u0438 \u0437\u043D\u044F\u043B\u0438 \u043E\u0431\u043B\u043E\u0433\u0443 ${s.name}.`,"info"),r()}},{label:"\u2190 \u0412\u0456\u0434\u0456\u0439\u0442\u0438 \u0432\u0456\u0434 \u0441\u0442\u0456\u043D (\u043E\u0431\u043B\u043E\u0433\u0430 \u0442\u0440\u0438\u0432\u0430\u0454)",onClick:r}],p=Ks({text:u,scene:ms("camp",He(s.faction).color,n.time%24),options:f});i?this.windows.update(i,{body:p}):i=this.windows.show({title:`\u041E\u0431\u043B\u043E\u0433\u0430: ${s.name}`,body:p,cls:"wide",onClose:()=>t.onMenuClosed()})};i=null,o()},autoAssault(s){let t=this.game,e=t.world,n=e.state,i=Zr(e,s),r=gi([{stacks:n.party.troops.map(l=>({key:"player",troopId:l.id,count:l.count-l.wounded})),bonus:1+hn(n,"tactics")*.04,woundChance:.25+hn(n,"surgery")*.05,heroes:Ia(e)},{stacks:[...s.garrison.map(l=>({key:"garrison",troopId:l.id,count:l.count-l.wounded})),...i.flatMap(l=>l.troops.map(c=>({key:l.id,troopId:c.id,count:c.count-c.wounded})))],bonus:1.4,woundChance:.3}]),o={outcome:r.winner===0?"victory":"autoDefeat",losses:r.losses,playerKills:[],auto:!0,heroesDown:[...r.heroesDown]},a=Ua(t,s,i,o);this.showBattleResult(a)}};var C0=["w1","w2","w3","shield","armor","helmet","horse"],xf={w1:"\u0417\u0431\u0440\u043E\u044F 1",w2:"\u0417\u0431\u0440\u043E\u044F 2",w3:"\u0417\u0431\u0440\u043E\u044F 3",shield:"\u0429\u0438\u0442",armor:"\u041E\u0431\u043B\u0430\u0434\u0443\u043D\u043E\u043A",helmet:"\u0428\u043E\u043B\u043E\u043C",horse:"\u041A\u0456\u043D\u044C"};function R0(s){return s?s.type==="weapon"?["w1","w2","w3"]:[s.slot]:[]}var vf={openParty(s){let t=this.game.world,e=t.state,n=e.player,i=e.party,r,o=()=>{let a=de(i.troops),l=t.partyLimit(),c=b("table",{class:"list"},b("tr",null,b("th",null,"\u0412\u043E\u0457\u043D\u0438"),b("th",null,"\u0422\u0438\u043F"),b("th",{class:"num"},"\u041A-\u0441\u0442\u044C"),b("th",null,"\u0414\u043E\u0441\u0432\u0456\u0434"),b("th",null,"\u041F\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u043D\u044F"),b("th",null,"")));i.troops.forEach((y,x)=>{let M=Gt[y.id],v=Xr(y),S=M.up.map(C=>{let _=Gt[C],A=M.upgradeCost,R=Math.min(v,A?Math.floor(n.gold/A):v);return bt(`\u2192 ${_.name}${A?` (${A})`:""}`,()=>{n.gold-=A*bh(i.troops,y,C,1),o()},"tiny",{disabled:R<=0,title:`\u041F\u043E\u043A\u0440\u0430\u0449\u0438\u0442\u0438 \u043E\u0434\u043D\u043E\u0433\u043E. ${Vr[_.type]}, \u0440\u0456\u0432\u0435\u043D\u044C ${_.tier}`})}),T=M.up.length===1&&v>1?bt("\u0443\u0441\u0456\u0445",()=>{let C=M.upgradeCost,_=Math.min(v,C?Math.floor(n.gold/C):v);n.gold-=C*bh(i.troops,y,M.up[0],_),o()},"tiny"):null;c.append(b("tr",null,b("td",null,b("b",null,M.name),b("div",{class:"muted",style:{fontSize:"12px"}},`\u0420\u0456\u0432\u0435\u043D\u044C ${M.tier} \xB7 ${M.hp} \u0437\u0434\u043E\u0440\u043E\u0432\u2019\u044F \xB7 \u043F\u043B\u0430\u0442\u043D\u044F ${M.wage}`)),b("td",null,Vr[M.type]),b("td",{class:"num"},y.count,y.wounded?b("span",{class:"bad"},` (${y.wounded} \u043F\u043E\u0440.)`):""),b("td",{style:{width:"90px"}},M.up.length?Ra(Math.min(1,y.xp/(M.upgradeXp*Math.max(1,y.count)))||(v>0?1:0),"xp"):b("span",{class:"muted"},"\u0435\u043B\u0456\u0442\u0430"),v?b("div",{class:"good",style:{fontSize:"12px"}},`\u0433\u043E\u0442\u043E\u0432\u0456: ${v}`):null),b("td",null,...S,T),b("td",{class:"num"},bt("\u25B2",()=>{x>0&&([i.troops[x-1],i.troops[x]]=[i.troops[x],i.troops[x-1]],o())},"tiny",{disabled:x===0,title:"\u0412\u0438\u0449\u0435 (\u0440\u0430\u043D\u0456\u0448\u0435 \u0432\u0438\u0445\u043E\u0434\u044F\u0442\u044C \u043D\u0430 \u043F\u043E\u043B\u0435 \u0431\u043E\u044E)"}),bt("\u25BC",()=>{x<i.troops.length-1&&([i.troops[x+1],i.troops[x]]=[i.troops[x],i.troops[x+1]],o())},"tiny",{disabled:x===i.troops.length-1}),bt("\u2715",()=>{confirm(`\u0420\u043E\u0437\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u0432\u043E\u0457\u043D\u0430 (${M.name})?`)&&(Mn(i.troops,y.id,1,!0),o())},"tiny danger",{title:"\u0420\u043E\u0437\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u043E\u0434\u043D\u043E\u0433\u043E"}))))}),i.troops.length||c.append(b("tr",null,b("td",{colSpan:6,class:"muted"},"\u0412\u0438 \u043F\u043E\u0434\u043E\u0440\u043E\u0436\u0443\u0454\u0442\u0435 \u0441\u0430\u043C\u0456. \u041D\u0430\u0431\u0435\u0440\u0456\u0442\u044C \u0434\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456\u0432 \u0443 \u0441\u0435\u043B\u0430\u0445 \u0430\u0431\u043E \u043D\u0430\u0439\u043C\u0456\u0442\u044C \u043D\u0430\u0439\u043C\u0430\u043D\u0446\u0456\u0432 \u0443 \u0442\u0430\u0432\u0435\u0440\u043D\u0456.")));let h=$n(e),d=b("table",{class:"list"},b("tr",null,b("th",null,"\u0421\u0443\u043F\u0443\u0442\u043D\u0438\u043A\u0438"),b("th",null,"\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F"),b("th",null,"\u041D\u0430\u0432\u0438\u0447\u043A\u0438"),b("th",null,"")));for(let y of h)d.append(b("tr",null,b("td",null,b("b",null,y.def.name),b("div",{class:"muted",style:{fontSize:"12px"}},`\u0420\u0456\u0432\u0435\u043D\u044C ${y.def.level} \xB7 \u043F\u043B\u0430\u0442\u043D\u044F ${Ws(y.def)}`)),b("td",{style:{width:"120px"}},Ra(y.st.hp/y.def.hp),b("span",{style:{fontSize:"12px"}},`${Math.round(y.st.hp)} / ${y.def.hp}`)),b("td",{style:{fontSize:"13px"}},Object.entries(y.def.skills).map(([x,M])=>`${zi[x].name} ${M}`).join(", ")),b("td",{class:"num"},bt("\u0412\u0456\u0434\u043F\u0443\u0441\u0442\u0438\u0442\u0438",()=>{if(!confirm(`\u0412\u0456\u0434\u043F\u0443\u0441\u0442\u0438\u0442\u0438 ${y.def.name}?`))return;y.st.hired=!1;let x=e.settlements.filter(M=>M.kind==="town");y.st.location=x[Math.floor(Math.random()*x.length)].id,o()},"tiny"))));let u=b("table",{class:"list"},b("tr",null,b("th",null,"\u041F\u043E\u043B\u043E\u043D\u0435\u043D\u0456"),b("th",{class:"num"},"\u041A-\u0441\u0442\u044C"),b("th",null,"")));for(let y of i.prisoners){let x=Gt[y.id];u.append(b("tr",null,b("td",null,x.name),b("td",{class:"num"},y.count),b("td",{class:"num"},x.faction!=="bandits"||x.tier<=2?bt("\u0417\u0430\u0432\u0435\u0440\u0431\u0443\u0432\u0430\u0442\u0438",()=>{if(t.isPlayerFull())return;let M=Math.max(1,Math.round(y.count*(.3+n.skills.leadership*.05))),v=Math.min(M,t.partySpace());Mn(i.prisoners,y.id,v),we(i.troops,y.id,v),t.message(`${v} \u043F\u043E\u043B\u043E\u043D\u0435\u043D\u0438\u0445 \u043F\u043E\u0433\u043E\u0434\u0438\u043B\u0438\u0441\u044F \u0441\u043B\u0443\u0436\u0438\u0442\u0438 \u0432\u0430\u043C.`,"good"),o()},"tiny",{disabled:t.isPlayerFull(),title:"\u0427\u0430\u0441\u0442\u0438\u043D\u0430 \u043F\u043E\u043B\u043E\u043D\u0435\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u0439\u0434\u0435 \u043D\u0430 \u0432\u0430\u0448 \u0431\u0456\u043A"}):null,bt("\u0412\u0456\u0434\u043F\u0443\u0441\u0442\u0438\u0442\u0438",()=>{i.prisoners.splice(i.prisoners.indexOf(y),1),o()},"tiny"))))}let f=Ys(n.inventory),p=Math.ceil((a+1)/3),g=b("p",null,"\u0420\u043E\u0437\u043C\u0456\u0440 \u0437\u0430\u0433\u043E\u043D\u0443: ",b("b",null,`${a+1+h.length} / ${l+1}`),` \xB7 \u041F\u043E\u0440\u0430\u043D\u0435\u043D\u0456: ${Vi(i.troops)} \xB7 \u041F\u043B\u0430\u0442\u043D\u044F: `,b("b",{class:"gold"},t.weeklyWages())," \u043D\u0430 \u0442\u0438\u0436\u0434\u0435\u043D\u044C \xB7 \u041C\u043E\u0440\u0430\u043B\u044C: ",b("b",null,t.playerMorale()),` \xB7 \u041F\u0440\u043E\u0432\u0456\u0437\u0456\u044F: ${f} \u043F\u043E\u0440\u0446\u0456\u0439 (${Math.floor(f/p)} ${Fi(Math.floor(f/p),"\u0434\u0435\u043D\u044C","\u0434\u043D\u0456","\u0434\u043D\u0456\u0432")})`),m=b("div",null,g,c,h.length?b("div",null,b("div",{class:"section-title"},"\u0421\u0443\u043F\u0443\u0442\u043D\u0438\u043A\u0438"),d):null,i.prisoners.length?b("div",null,b("div",{class:"section-title"},`\u041F\u043E\u043B\u043E\u043D\u0435\u043D\u0456 (${de(i.prisoners)} / ${t.prisonerLimit()})`),u):null,b("p",{class:"muted",style:{fontSize:"13px"}},"\u0412\u043E\u0457\u043D\u0438 \u043E\u0442\u0440\u0438\u043C\u0443\u044E\u0442\u044C \u0434\u043E\u0441\u0432\u0456\u0434 \u0443 \u0431\u043E\u044F\u0445 (\u0456 \u0432\u0456\u0434 \u043D\u0430\u0432\u0438\u0447\u043A\u0438 \xAB\u0422\u0440\u0435\u043D\u0435\u0440\xBB). \u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0443 \u0441\u043F\u0438\u0441\u043A\u0443 \u0432\u0438\u0437\u043D\u0430\u0447\u0430\u0454, \u0445\u0442\u043E \u043F\u0435\u0440\u0448\u0438\u043C \u0432\u0438\u0445\u043E\u0434\u0438\u0442\u044C \u043D\u0430 \u043F\u043E\u043B\u0435 \u0431\u043E\u044E."));r?this.windows.update(r,{body:m}):r=this.windows.show({title:"\u0417\u0430\u0433\u0456\u043D",body:m,cls:"wide",onClose:s,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(r),"primary")]})};o()},openCharacter(s){let e=this.game.world.state,n=e.player,i,r=()=>{let o=b("div",{class:"stat-grid"});for(let[d,u]of Object.entries(Vs))o.append(b("span",{title:u.desc},u.name),b("b",null,n.attrs[d]),bt("+",()=>{n.attrPoints<=0||(n.attrPoints--,n.attrs[d]++,d==="int"&&n.skillPoints++,d==="str"&&(n.hp+=1),r())},"tiny",{disabled:n.attrPoints<=0}));let a=b("div",{class:"stat-grid"});for(let[d,u]of Object.entries(zi)){let f=Ju(n,d);a.append(b("span",{title:`${u.desc} \u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C: ${Vs[u.attr].name}/3 = ${f}`},u.name,b("span",{class:"muted",style:{fontSize:"12px"}},` (${Vs[u.attr].name.slice(0,3)})`)),b("b",null,n.skills[d]),bt("+",()=>{n.skillPoints<=0||n.skills[d]>=f||(n.skillPoints--,n.skills[d]++,d==="ironflesh"&&(n.hp+=3),r())},"tiny",{disabled:n.skillPoints<=0||n.skills[d]>=f,title:n.skills[d]>=f?"\u041F\u0456\u0434\u0432\u0438\u0449\u0456\u0442\u044C \u0430\u0442\u0440\u0438\u0431\u0443\u0442":u.desc}))}let l=Gr(n.level),c=b("table",{class:"list"});for(let d of Re){let u=Math.round(e.factions[d].relation);c.append(b("tr",null,b("td",null,Yr(Ht[d].color),Ht[d].name),b("td",{class:`num ${u>=0?"good":"bad"}`},u)))}let h=b("div",{class:"cols"},b("div",null,b("div",{class:"section-title"},n.name),b("p",null,`\u0420\u0456\u0432\u0435\u043D\u044C ${n.level} \xB7 \u0414\u043E\u0441\u0432\u0456\u0434 ${n.xp} / ${l}`),Ra(n.xp/l,"xp"),b("p",null,`\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F: ${Math.round(n.hp)} / ${Wn(n)} \xB7 \u0421\u043B\u0430\u0432\u0430: ${n.renown} \xB7 \u0417\u043E\u043B\u043E\u0442\u043E: ${n.gold}`),b("p",null,`\u041F\u0435\u0440\u0435\u043C\u043E\u0433: ${n.battlesWon} \xB7 \u041F\u043E\u0432\u0430\u043B\u0435\u043D\u043E \u0432\u043E\u0440\u043E\u0433\u0456\u0432 \u0432\u043B\u0430\u0441\u043D\u043E\u0440\u0443\u0447: ${n.kills}`),b("div",{class:"section-title"},`\u0410\u0442\u0440\u0438\u0431\u0443\u0442\u0438 ${n.attrPoints?`(\u0432\u0456\u043B\u044C\u043D\u0438\u0445 \u043E\u0447\u043E\u043A: ${n.attrPoints})`:""}`),o,b("div",{class:"section-title"},"\u0421\u0442\u043E\u0441\u0443\u043D\u043A\u0438 \u0437 \u0444\u0440\u0430\u043A\u0446\u0456\u044F\u043C\u0438"),c),b("div",null,b("div",{class:"section-title"},`\u041D\u0430\u0432\u0438\u0447\u043A\u0438 ${n.skillPoints?`(\u0432\u0456\u043B\u044C\u043D\u0438\u0445 \u043E\u0447\u043E\u043A: ${n.skillPoints})`:""}`),a,b("p",{class:"muted",style:{fontSize:"13px"}},"\u041A\u043E\u0436\u0435\u043D \u0440\u0456\u0432\u0435\u043D\u044C \u0434\u0430\u0454 \u043E\u0447\u043A\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0443 \u0456 \u043E\u0447\u043A\u043E \u043D\u0430\u0432\u0438\u0447\u043A\u0438. \u0420\u0456\u0432\u0435\u043D\u044C \u043D\u0430\u0432\u0438\u0447\u043A\u0438 \u043D\u0435 \u043C\u043E\u0436\u0435 \u043F\u0435\u0440\u0435\u0432\u0438\u0449\u0443\u0432\u0430\u0442\u0438 \u0442\u0440\u0435\u0442\u0438\u043D\u0443 \u043F\u043E\u0432\u2019\u044F\u0437\u0430\u043D\u043E\u0433\u043E \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430.")));i?this.windows.update(i,{body:h}):i=this.windows.show({title:"\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u0436",body:h,cls:"wide",onClose:s,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(i),"primary")]})};r()},openInventory(s){let n=this.game.world.state.player,i,r=()=>{let o=n.equipment,a=b("div",{class:"equip-grid"});for(let d of C0){let u=wt[o[d]];a.append(b("div",{class:"slot"},b("div",{class:"slot-name"},xf[d]),u?b("div",null,b("div",{class:"item-name"},u.name),b("div",{class:"item-desc"},us(u)),bt("\u0417\u043D\u044F\u0442\u0438",()=>{if(vi(n.inventory)>=xi){this.toast("\u041D\u0435\u043C\u0430\u0454 \u043C\u0456\u0441\u0446\u044F \u0432 \u0456\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0456");return}An(n.inventory,o[d],1),o[d]=null,r()},"tiny")):b("div",{class:"muted"},"\u2014 \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E \u2014")))}let l=b("table",{class:"list"},b("tr",null,b("th",null,"\u0406\u043D\u0432\u0435\u043D\u0442\u0430\u0440"),b("th",{class:"num"},"\u041A-\u0441\u0442\u044C"),b("th",null,""))),c=[...n.inventory].sort((d,u)=>wt[d.id].type.localeCompare(wt[u.id].type));for(let d of c){let u=wt[d.id],f=[];if(Hs(d.id))for(let p of R0(u))f.push(bt(p.startsWith("w")?`\u0423 ${p.slice(1)}`:"\u0412\u0434\u044F\u0433\u043D\u0443\u0442\u0438",()=>{let g=o[p];u.twoHanded&&o.shield,Xn(n.inventory,d.id,1),g&&An(n.inventory,g,1),o[p]=d.id,r()},"tiny",{title:`\u0412\u0434\u044F\u0433\u043D\u0443\u0442\u0438: ${xf[p]}`}));l.append(b("tr",null,b("td",null,b("b",null,u.name),b("div",{class:"muted",style:{fontSize:"12px"}},us(u))),b("td",{class:"num"},d.qty),b("td",{class:"num"},...f," ",u.type!=="quest"?bt("\u0412\u0438\u043A\u0438\u043D\u0443\u0442\u0438",()=>{confirm(`\u0412\u0438\u043A\u0438\u043D\u0443\u0442\u0438 ${u.name}?`)&&(Xn(n.inventory,d.id,1),r())},"tiny danger"):null)))}n.inventory.length||l.append(b("tr",null,b("td",{colSpan:3,class:"muted"},"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E")));let h=b("div",{class:"cols"},b("div",null,b("div",{class:"section-title"},"\u0421\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F"),a,b("p",{class:"muted",style:{fontSize:"13px"}},"\u0423 \u0431\u043E\u044E: \u043A\u043B\u0430\u0432\u0456\u0448\u0430 Q \u0430\u0431\u043E \u043A\u043E\u043B\u0456\u0449\u0430\u0442\u043A\u043E \u043C\u0438\u0448\u0456 \u043F\u0435\u0440\u0435\u043C\u0438\u043A\u0430\u044E\u0442\u044C \u0437\u0431\u0440\u043E\u044E 1\u20133. \u0414\u0432\u043E\u0440\u0443\u0447\u043D\u0430 \u0437\u0431\u0440\u043E\u044F \u043D\u0435 \u0434\u043E\u0437\u0432\u043E\u043B\u044F\u0454 \u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u0449\u0438\u0442.")),b("div",null,b("div",{class:"section-title"},`\u0406\u043D\u0432\u0435\u043D\u0442\u0430\u0440 (${vi(n.inventory)} / ${xi})`),l));i?this.windows.update(i,{body:h}):i=this.windows.show({title:"\u0421\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F \u0442\u0430 \u0456\u043D\u0432\u0435\u043D\u0442\u0430\u0440",body:h,cls:"wide",onClose:s,footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(i),"primary")]})};r()},openJournal(){let s=this.game.world,t=s.state,e=t.quests.filter(h=>h.status==="active"),n=b("div",null);e.length||n.append(b("p",{class:"muted"},"\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0445 \u0437\u0430\u0432\u0434\u0430\u043D\u044C \u043D\u0435\u043C\u0430\u0454. \u0426\u0435\u0445\u043E\u0432\u0456 \u043C\u0430\u0439\u0441\u0442\u0440\u0438 \u0432 \u043C\u0456\u0441\u0442\u0430\u0445 \u0448\u0443\u043A\u0430\u044E\u0442\u044C \u0441\u043C\u0456\u043B\u0438\u0432\u0446\u0456\u0432."));for(let h of e)n.append(b("div",{class:"slot",style:{marginBottom:"6px"}},b("div",{class:"item-name"},h.title),b("div",null,h.desc),b("div",{class:"muted"},`\u0417\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044C \u0434\u043D\u0456\u0432: ${Math.max(0,h.deadline-s.day)} \xB7 \u041D\u0430\u0433\u043E\u0440\u043E\u0434\u0430: ${h.reward} \u0437\u043E\u043B\u043E\u0442\u0430`)));let i=t.contract?b("p",null,t.contract.vassal?`\u0412\u0438 \u2014 \u0432\u0430\u0441\u0430\u043B: ${Ht[t.contract.faction].name}.`:`\u041D\u0430\u0439\u043C\u0430\u043D\u0441\u044C\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u0437 ${Ht[t.contract.faction].name} \u0434\u043E \u0434\u043D\u044F ${t.contract.until}.`):b("p",{class:"muted"},"\u0412\u0438 \u2014 \u0432\u0456\u043B\u044C\u043D\u0438\u0439 \u043D\u0430\u0439\u043C\u0430\u043D\u0435\u0446\u044C \u0431\u0435\u0437 \u0441\u044E\u0437\u0435\u0440\u0435\u043D\u0430."),r=t.settlements.filter(h=>h.owner==="player"),o=r.length?b("p",null,`\u0412\u0430\u0448\u0456 \u0432\u043E\u043B\u043E\u0434\u0456\u043D\u043D\u044F: ${r.map(h=>h.name).join(", ")}.`):null,a=b("div",{style:{maxHeight:"280px",overflow:"auto",fontSize:"14px"}});for(let h of[...t.log].reverse().slice(0,120)){let{day:d,text:u}=_a(h.t);a.append(b("div",null,b("span",{class:"muted"},`\u0414\u0435\u043D\u044C ${d}, ${u} \u2014 `),h.text))}let l=b("div",null,b("div",{class:"section-title"},"\u0421\u043B\u0443\u0436\u0431\u0430"),i,o,b("div",{class:"section-title"},"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F"),n,b("div",{class:"section-title"},"\u0425\u0440\u043E\u043D\u0456\u043A\u0430"),a),c=this.windows.show({title:"\u0416\u0443\u0440\u043D\u0430\u043B",body:l,footer:[bt("\u0417\u0430\u043A\u0440\u0438\u0442\u0438",()=>this.windows.close(c),"primary")]})},openFactions(){let s=this.game.world,t=s.state,e,n=()=>{let i=b("table",{class:"list"},b("tr",null,b("th",null,"\u0424\u0440\u0430\u043A\u0446\u0456\u044F"),b("th",{class:"num"},"\u041C\u0456\u0441\u0442\u0430"),b("th",{class:"num"},"\u0417\u0430\u043C\u043A\u0438"),b("th",{class:"num"},"\u041B\u043E\u0440\u0434\u0438"),b("th",null,"\u0412\u043E\u044E\u0454 \u0437"),b("th",{class:"num"},"\u0421\u0442\u043E\u0441\u0443\u043D\u043A\u0438"),b("th",null,"")));for(let a of Re){let l=Ht[a],c=t.settlements.filter(y=>y.faction===a&&y.kind==="town").length,h=t.settlements.filter(y=>y.faction===a&&y.kind==="castle").length,d=t.parties.filter(y=>y.faction===a&&y.kind==="lord").length,u=Re.filter(y=>y!==a&&s.atWar(a,y)).map(y=>Ht[y].short),f=s.isHostile(a,"player"),p=t.wars[Ke("player",a)];p&&u.push("\u0432\u0430\u043C\u0438");let g=Math.round(t.factions[a].relation),m=this.peaceCost(a);i.append(b("tr",null,b("td",null,Yr(l.color),b("b",null,l.name),t.factions[a].defeated?b("span",{class:"muted"}," (\u0437\u043D\u0438\u0449\u0435\u043D\u043E)"):null,b("div",{class:"muted",style:{fontSize:"12px"}},l.king)),b("td",{class:"num"},c),b("td",{class:"num"},h),b("td",{class:"num"},d),b("td",null,u.join(", ")||"\u2014"),b("td",{class:`num ${g>=0?"good":"bad"}`},g,f?b("div",{class:"bad",style:{fontSize:"12px"}},"\u0432\u043E\u0440\u043E\u0436\u0456"):null),b("td",null,p?bt(`\u041C\u0438\u0440 (${m})`,()=>{this.makePeace(a),n()},"tiny",{disabled:t.player.gold<m}):null)))}let r=t.settlements.filter(a=>a.faction==="player"),o=b("div",null,i,r.length?b("p",null,b("b",null,"\u0412\u0430\u0448\u0435 \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u043E: "),r.map(a=>a.name).join(", ")):null,b("p",{class:"muted",style:{fontSize:"13px"}},"\u0412\u043E\u0440\u043E\u0436\u0456 \u0444\u0440\u0430\u043A\u0446\u0456\u0457 \u0430\u0442\u0430\u043A\u0443\u0432\u0430\u0442\u0438\u043C\u0443\u0442\u044C \u0432\u0430\u0448 \u0437\u0430\u0433\u0456\u043D. \u0421\u0442\u043E\u0441\u0443\u043D\u043A\u0438 \u043D\u0438\u0436\u0447\u0435 \u221210 \u0440\u043E\u0431\u043B\u044F\u0442\u044C \u0444\u0440\u0430\u043A\u0446\u0456\u044E \u0432\u043E\u0440\u043E\u0436\u043E\u044E. \u041D\u0430\u0439\u043C\u0430\u043D\u0435\u0446\u044C \u0432\u043E\u044E\u0454 \u0437 \u0432\u043E\u0440\u043E\u0433\u0430\u043C\u0438 \u0441\u0432\u043E\u0433\u043E \u043D\u0430\u0439\u043C\u0430\u0447\u0430."));e?this.windows.update(e,{body:o}):e=this.windows.show({title:"\u0424\u0440\u0430\u043A\u0446\u0456\u0457 \u041A\u0430\u043B\u044C\u0434\u0435\u0440\u0456\u0457",body:o,cls:"wide",footer:[bt("\u0417\u0430\u043A\u0440\u0438\u0442\u0438",()=>this.windows.close(e),"primary")]})};n()}};var Vh={lord:["\xAB\u0414\u043E\u0440\u043E\u0433\u0438 \u043D\u0438\u043D\u0456 \u043D\u0435\u0431\u0435\u0437\u043F\u0435\u0447\u043D\u0456, \u043C\u0430\u043D\u0434\u0440\u0456\u0432\u043D\u0438\u043A\u0443. \u0422\u0440\u0438\u043C\u0430\u0439 \u043C\u0435\u0447 \u043D\u0430\u043F\u043E\u0433\u043E\u0442\u043E\u0432\u0456.\xBB","\xAB\u041C\u043E\u0457 \u043B\u044E\u0434\u0438 \u0432\u0442\u043E\u043C\u0438\u043B\u0438\u0441\u044F, \u0430\u043B\u0435 \u0441\u043B\u0443\u0436\u0431\u0430 \u043A\u043E\u0440\u043E\u043B\u044E \u043F\u043E\u043D\u0430\u0434 \u0443\u0441\u0435.\xBB","\xAB\u042F\u043A\u0449\u043E \u0448\u0443\u043A\u0430\u0454\u0448 \u0441\u043B\u0430\u0432\u0438 \u2014 \u043F\u0440\u0438\u0445\u043E\u0434\u044C \u0434\u043E \u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u0437\u0430\u043B\u0438.\xBB"],caravan:["\xAB\u041C\u0438 \u043B\u0438\u0448\u0435 \u0447\u0435\u0441\u043D\u0456 \u043A\u0443\u043F\u0446\u0456. \u0422\u043E\u0432\u0430\u0440\u0438 \u0437 \u043F\u0456\u0432\u0434\u043D\u044F, \u0446\u0456\u043D\u0438 \u2014 \u043D\u0430\u0439\u043A\u0440\u0430\u0449\u0456!\xBB","\xAB\u0411\u0430\u0447\u0438\u043B\u0438 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0456\u0432 \u0431\u0456\u043B\u044F \u0431\u0440\u043E\u0434\u0443. \u0411\u0443\u0434\u044C\u0442\u0435 \u043E\u0431\u0435\u0440\u0435\u0436\u043D\u0456.\xBB"],bandit:["\xAB\u0413\u0430\u043C\u0430\u043D\u0435\u0446\u044C \u0430\u0431\u043E \u0436\u0438\u0442\u0442\u044F!\xBB"]};function P0(s,t){let e=s.strength(t)/Math.max(1,s.strength(s.state.party));return e>1.8?"\u0412\u043E\u043D\u0438 \u0437\u043D\u0430\u0447\u043D\u043E \u043F\u0435\u0440\u0435\u0432\u0430\u0436\u0430\u044E\u0442\u044C \u0432\u0430\u0441.":e>1.15?"\u0412\u043E\u043D\u0438 \u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0456 \u0437\u0430 \u0432\u0430\u0441.":e>.85?"\u0421\u0438\u043B\u0438 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E \u0440\u0456\u0432\u043D\u0456.":e>.5?"\u0412\u0438 \u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0456 \u0437\u0430 \u043D\u0438\u0445.":"\u0412\u0438 \u0437\u043D\u0430\u0447\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0456."}function I0(s){return[...s].sort((e,n)=>Gt[n.id].tier-Gt[e.id].tier||n.count-e.count).map(e=>`  ${Gt[e.id].name}: ${e.count-e.wounded}${e.wounded?` (+${e.wounded} \u043F\u043E\u0440.)`:""}`).join(`
`)}var _f={openEncounter(s,t){let e=this.game,n=e.world,i=n.state,r=n.pById.get(s);if(!r)return;r.held=!0;let o=n.isHostile(r.faction,"player"),a=He(r.faction),l,c=()=>{r.held=!1,this.windows.close(l)},h=()=>{this.windows.close(l),!o&&Ht[r.faction]&&n.declarePlayerWar(r.faction),r.held=!1,Da(e,{enemies:[r]})},d=[];t==="ai"&&o?d.push(r.kind==="bandit"?`${r.name} \u043F\u0435\u0440\u0435\u0433\u043E\u0440\u043E\u0434\u0436\u0443\u044E\u0442\u044C \u0432\u0430\u043C \u0448\u043B\u044F\u0445! ${lt.pick(Vh.bandit)}`:`${r.name} \u0430\u0442\u0430\u043A\u0443\u0454 \u0432\u0430\u0441!`):d.push(`\u0412\u0438 \u0437\u0443\u0441\u0442\u0440\u0456\u043B\u0438: ${r.name} (${a.name}).`),d.push(`
\u0412\u043E\u0457\u043D\u0456\u0432: ${de(r.troops)}. ${P0(n,r)}`),d.push(I0(r.troops)),d.push(`
\u0412\u0430\u0448\u0438\u0445 \u0431\u043E\u0454\u0437\u0434\u0430\u0442\u043D\u0438\u0445 \u0432\u043E\u0457\u043D\u0456\u0432: ${ke(i.party.troops)} + \u0432\u0438.`),i.player.hp<25&&d.push("\u0412\u0438 \u043F\u043E\u0440\u0430\u043D\u0435\u043D\u0456 \u0456 \u043E\u0441\u043B\u0430\u0431\u043B\u0435\u043D\u0456.");let u=[];o?(u.push({label:"\u2694 \u0414\u043E \u0431\u043E\u044E!",cls:"primary",onClick:h}),u.push({label:"\u2691 \u0414\u043E\u0440\u0443\u0447\u0438\u0442\u0438 \u0431\u0456\u0439 \u0437\u0430\u0433\u043E\u043D\u0443",hint:"\u0431\u0435\u0437 \u0432\u0430\u0441",disabled:ke(i.party.troops)===0,onClick:()=>{this.windows.close(l),r.held=!1,Fh(e,{enemies:[r]})}}),t==="ai"?u.push({label:"\u21A9 \u0421\u043F\u0440\u043E\u0431\u0443\u0432\u0430\u0442\u0438 \u0432\u0442\u0435\u043A\u0442\u0438",hint:de(i.party.troops)?"\u0432\u0442\u0440\u0430\u0442\u0438\u0442\u0435 \u0447\u0430\u0441\u0442\u0438\u043D\u0443 \u0437\u0430\u0433\u043E\u043D\u0443":"",onClick:()=>{let p=Hh(n,r);c(),p.length?n.message(`\u0412\u0438 \u0432\u0442\u0435\u043A\u043B\u0438, \u0437\u0430\u043B\u0438\u0448\u0438\u0432\u0448\u0438 \u043F\u043E\u0437\u0430\u0434\u0443: ${p.map(([g,m])=>`${Gt[g].name} \xD7${m}`).join(", ")}.`,"warn"):n.message("\u0412\u0430\u043C \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0456\u0434\u0456\u0440\u0432\u0430\u0442\u0438\u0441\u044F \u0432\u0456\u0434 \u043F\u0435\u0440\u0435\u0441\u043B\u0456\u0434\u0443\u0432\u0430\u0447\u0456\u0432.","info")}}):u.push({label:"\u2190 \u0412\u0456\u0434\u0456\u0439\u0442\u0438",onClick:()=>{i.party.graceUntil=i.time+1,c()}})):(u.push({label:"\u263A \u041F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0438",onClick:()=>{let p=Vh[r.kind]||Vh.lord;this.toast(lt.pick(p),3500)}}),r.kind==="lord"&&i.contract&&i.contract.faction===r.faction&&u.push({label:"\u2691 \u0417\u0430\u043F\u0438\u0442\u0430\u0442\u0438 \u043F\u0440\u043E \u0432\u043E\u0440\u043E\u0433\u0456\u0432",onClick:()=>{let p=Object.keys(Ht).filter(g=>n.atWar(r.faction,g)).map(g=>Ht[g].name);this.toast(p.length?`\xAB\u041C\u0438 \u0432\u043E\u044E\u0454\u043C\u043E \u0437: ${p.join(", ")}.\xBB`:"\xAB\u041D\u0438\u043D\u0456 \u0432 \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u0456 \u043C\u0438\u0440.\xBB",3500)}}),u.push({label:`\u2694 \u041D\u0430\u043F\u0430\u0441\u0442\u0438 (\u0432\u0456\u0439\u043D\u0430 \u0437 ${a.short||a.name})`,cls:"danger",onClick:()=>{confirm(`\u041D\u0430\u043F\u0430\u0434 \u043D\u0430 ${r.name} \u043E\u0437\u043D\u0430\u0447\u0430\u0454 \u0432\u0456\u0439\u043D\u0443 \u0437 ${a.name}. \u0412\u0438 \u0432\u043F\u0435\u0432\u043D\u0435\u043D\u0456?`)&&h()}}),u.push({label:"\u2190 \u041F\u0456\u0442\u0438 \u0441\u0432\u043E\u0454\u044E \u0434\u043E\u0440\u043E\u0433\u043E\u044E",onClick:()=>{i.party.graceUntil=i.time+.5,c()}}));let f=Ks({text:d.join(`
`),scene:ms("battle",a.color,i.time%24),options:u});l=this.windows.show({title:r.name,body:f,cls:"wide",closable:!1,onClose:()=>e.onMenuClosed()})},openBattleSite(s){let t=this.game,e=t.world,n=e.state,i=n.battles.find(d=>d.id===s);if(!i){t.onMenuClosed();return}let r=i.sides.map(d=>d.map(u=>e.pById.get(u)).filter(Boolean));if(!r[0].length||!r[1].length){t.onMenuClosed();return}i.playerJoined=!0;let o,a=()=>{i.playerJoined=!1,this.windows.close(o)},l=["\u0412\u0438 \u043D\u0430\u0442\u0440\u0430\u043F\u0438\u043B\u0438 \u043D\u0430 \u0431\u0438\u0442\u0432\u0443!","",...r.map((d,u)=>`${u?"\u041F\u0440\u043E\u0442\u0438 \u043D\u0438\u0445: ":"\u0417 \u043E\u0434\u043D\u043E\u0433\u043E \u0431\u043E\u043A\u0443: "}${d.map(f=>`${f.name} (${de(f.troops)})`).join(", ")}`)].join(`
`),c=[];r.forEach((d,u)=>{let f=r[1-u],p=d[0],g=!e.isHostile(p.faction,"player");c.push({label:`\u2694 \u0414\u043E\u043F\u043E\u043C\u043E\u0433\u0442\u0438: ${p.name}`,disabled:!g,title:g?"":"\u0412\u043E\u043D\u0438 \u0432\u043E\u0440\u043E\u0436\u0456 \u0434\u043E \u0432\u0430\u0441",onClick:()=>{this.windows.close(o);for(let m of f)Ht[m.faction]&&!e.isHostile(m.faction,"player")&&e.declarePlayerWar(m.faction);Da(t,{enemies:f,allies:d,mapBattle:i})}})}),c.push({label:"\u2190 \u041D\u0435 \u0432\u0442\u0440\u0443\u0447\u0430\u0442\u0438\u0441\u044F",onClick:()=>{n.party.graceUntil=n.time+.5,a()}});let h=Ks({text:l,scene:ms("battle","#a8322a",n.time%24),options:c});o=this.windows.show({title:"\u0411\u0438\u0442\u0432\u0430",body:h,cls:"wide",closable:!1,onClose:()=>t.onMenuClosed()})},showBattleResult(s){let t=this.game,e=t.world,n=e.state,i={victory:"\u041F\u0435\u0440\u0435\u043C\u043E\u0433\u0430!",defeat:"\u041F\u043E\u0440\u0430\u0437\u043A\u0430",retreat:"\u0412\u0456\u0434\u0441\u0442\u0443\u043F",autoDefeat:"\u041F\u043E\u0440\u0430\u0437\u043A\u0430",arenaWin:"\u0422\u0440\u0456\u0443\u043C\u0444 \u043D\u0430 \u0430\u0440\u0435\u043D\u0456",arenaLoss:"\u0410\u0440\u0435\u043D\u0430"},r=f=>{let p=[],g=new Set([...Object.keys(f.killed),...Object.keys(f.wounded)]);for(let m of g){let y=f.killed[m]||0,x=f.wounded[m]||0;p.push(b("tr",null,b("td",null,Gt[m].name),b("td",{class:"num bad"},y||""),b("td",{class:"num"},x||"")))}return p.length?b("table",{class:"list"},b("tr",null,b("th",null,""),b("th",{class:"num"},"\u0417\u0430\u0433\u0438\u043D\u0443\u043B\u0438"),b("th",{class:"num"},"\u041F\u043E\u0440\u0430\u043D\u0435\u043D\u0456")),...p):b("p",{class:"muted"},"\u0411\u0435\u0437 \u0432\u0442\u0440\u0430\u0442.")},o=[];for(let f of s.notes)o.push(b("p",null,f));let a=[];s.gold&&a.push(`${s.gold} \u0437\u043E\u043B\u043E\u0442\u0430`),s.xp&&a.push(`${s.xp} \u0434\u043E\u0441\u0432\u0456\u0434\u0443`),s.renown&&a.push(`${s.renown} \u0441\u043B\u0430\u0432\u0438`),s.kills&&a.push(`\u0432\u043B\u0430\u0441\u043D\u043E\u0440\u0443\u0447 \u043F\u043E\u0432\u0430\u043B\u0435\u043D\u043E: ${s.kills}`),a.length&&o.push(b("p",null,b("b",null,"\u0417\u0434\u043E\u0431\u0443\u0442\u043E: "),a.join(" \xB7 "))),s.items.length&&o.push(b("p",null,b("b",null,"\u0422\u0440\u043E\u0444\u0435\u0457: "),s.items.map(([f,p])=>`${wt[f].name}${p>1?` \xD7${p}`:""}`).join(", ")));let l=Object.entries(s.prisoners);l.length&&o.push(b("p",null,b("b",null,"\u041F\u043E\u043B\u043E\u043D\u0435\u043D\u0456: "),l.map(([f,p])=>`${Gt[f].name} \xD7${p}`).join(", ")));let c=s.outcome.startsWith("arena"),h=null;s.freed?.length&&(h=bt("\u041F\u0440\u0438\u0439\u043D\u044F\u0442\u0438 \u0437\u0432\u0456\u043B\u044C\u043D\u0435\u043D\u0438\u0445 \u0434\u043E \u0437\u0430\u0433\u043E\u043D\u0443",()=>{let f=e.partyLimit()-de(n.party.troops);for(let p of s.freed){let g=Math.min(f,p.count);g>0&&we(n.party.troops,p.id,g),f-=g}s.freed=null,h.disabled=!0,h.textContent="\u0417\u0432\u0456\u043B\u044C\u043D\u0435\u043D\u0456 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u043B\u0438\u0441\u044F"},"small"),o.push(h));let d=b("div",null,ms(c?"arena":"battle",s.outcome==="victory"?"#3f7a3a":"#a8322a",n.time%24),...o,c?null:b("div",{class:"cols"},b("div",null,b("div",{class:"section-title"},"\u0412\u0430\u0448\u0456 \u0432\u0442\u0440\u0430\u0442\u0438"),r(s.playerLoss)),b("div",null,b("div",{class:"section-title"},"\u0412\u0442\u0440\u0430\u0442\u0438 \u0432\u043E\u0440\u043E\u0433\u0430"),r(s.enemyLoss)))),u=this.windows.show({title:i[s.outcome]||"\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0431\u0438\u0442\u0432\u0438",body:d,cls:"wide",onClose:()=>{t.autosave(),t.onMenuClosed()},footer:[bt("\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438",()=>this.windows.close(u),"primary")]})}};var Kr=class{constructor(t,e){this.game=t,this.root=e,this.windows=new Ca(e),this.screen=null}clearScreen(){this.screen&&this.screen.remove(),this.screen=null}toast(t,e=2200){let n=b("div",{class:"toast"},t);this.root.append(n),setTimeout(()=>n.remove(),e)}loading(t){let e=b("div",{class:"loading"},t);return this.root.append(e),()=>e.remove()}showMainMenu(){this.clearScreen(),this.windows.closeAll();let t=this.game,n=t.listSaves().filter(r=>r.info).sort((r,o)=>o.info.savedAt-r.info.savedAt)[0],i=b("div",{class:"screen"},b("div",{class:"title-block"},b("h1",null,"\u041A\u0456\u043D\u044C \u0456 \u041A\u043B\u0438\u043D\u043E\u043A"),b("div",{class:"subtitle"},"\u0425\u0440\u043E\u043D\u0456\u043A\u0438 \u041A\u0430\u043B\u044C\u0434\u0435\u0440\u0456\u0457"),b("div",{class:"menu-list"},n?bt(`\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438 (${n.info.name}, \u0434\u0435\u043D\u044C ${n.info.day})`,()=>t.loadGame(n.slot),"primary"):null,bt("\u041D\u043E\u0432\u0430 \u0433\u0440\u0430",()=>this.showCharacterCreation(),n?"":"primary"),bt("\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438",()=>this.openSaveLoad(!1)),bt("\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",()=>this.openSettings()),bt("\u042F\u043A \u0433\u0440\u0430\u0442\u0438",()=>this.openHelp())),b("div",{class:"footer"},"\u0421\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0432\u0456\u0447\u043D\u0430 \u043F\u0456\u0441\u043E\u0447\u043D\u0438\u0446\u044F \u0432 \u0434\u0443\u0441\u0456 Mount & Blade \xB7 \u043A\u0456\u043D\u043D\u0456 \u0431\u0438\u0442\u0432\u0438, \u043E\u0431\u043B\u043E\u0433\u0438, \u0442\u043E\u0440\u0433\u0456\u0432\u043B\u044F \u0442\u0430 \u043F\u043E\u043B\u0456\u0442\u0438\u043A\u0430")));this.root.append(i),this.screen=i}showCharacterCreation(){let t="knight",e=b("input",{type:"text",value:"\u042F\u0440\u043E\u0441\u043B\u0430\u0432",maxLength:24}),n=b("div",{class:"choice-grid"}),i=b("div",{class:"muted",style:{marginTop:"10px",minHeight:"60px"}}),r=()=>{n.innerHTML="";for(let[h,d]of Object.entries(Gs))n.append(b("div",{class:`choice ${h===t?"selected":""}`,onclick:()=>{t=h,r()}},b("h4",null,d.name),b("p",null,d.desc)));let l=Gs[t],c=Object.entries(l.attrs).map(([h,d])=>`${Vs[h].name} +${d}`).join(", ");i.innerHTML=`<b>\u0411\u043E\u043D\u0443\u0441\u0438:</b> ${c}. <b>\u0417\u043E\u043B\u043E\u0442\u043E:</b> ${l.gold}.`};r();let o=b("div",null,b("p",null,"\u041A\u0430\u043B\u044C\u0434\u0435\u0440\u0456\u044E \u0440\u043E\u0437\u0440\u0438\u0432\u0430\u044E\u0442\u044C \u0432\u0456\u0439\u043D\u0438 \u0447\u043E\u0442\u0438\u0440\u044C\u043E\u0445 \u0434\u0435\u0440\u0436\u0430\u0432. \u041A\u043E\u0440\u043E\u043B\u0456 \u0448\u0443\u043A\u0430\u044E\u0442\u044C \u043C\u0435\u0447\u0456, \u043A\u0443\u043F\u0446\u0456 \u2014 \u043E\u0445\u043E\u0440\u043E\u043D\u0443, \u0430 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438 \u2014 \u043B\u0435\u0433\u043A\u0443 \u0437\u0434\u043E\u0431\u0438\u0447. \u041A\u0438\u043C \u0432\u0438 \u0431\u0443\u043B\u0438, \u043F\u0435\u0440\u0448 \u043D\u0456\u0436 \u0432\u0438\u0440\u0443\u0448\u0438\u0442\u0438 \u043D\u0430\u0437\u0443\u0441\u0442\u0440\u0456\u0447 \u0434\u043E\u043B\u0456?"),b("div",{class:"field"},b("label",null,"\u0406\u043C\u2019\u044F"),e),b("div",{class:"field"},b("label",null,"\u041F\u043E\u0445\u043E\u0434\u0436\u0435\u043D\u043D\u044F"),n),i),a=this.windows.show({title:"\u041D\u043E\u0432\u0438\u0439 \u0433\u0435\u0440\u043E\u0439",body:o,cls:"wide",footer:[bt("\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",()=>this.windows.close(a)),bt("\u0412\u0438\u0440\u0443\u0448\u0438\u0442\u0438 \u0432 \u0434\u043E\u0440\u043E\u0433\u0443",()=>{this.windows.close(a),this.game.newGame({name:e.value.trim()||"\u041C\u0430\u043D\u0434\u0440\u0456\u0432\u043D\u0438\u043A",background:t})},"primary")]})}openSettings(){let t=this.game,e=t.settings,n=(c,h)=>b("div",{class:"settings-row"},b("span",null,c),h),i=(c,h,d,u,f=p=>p)=>{let p=b("span",{style:{width:"50px",display:"inline-block",textAlign:"right"}},f(e[c])),g=b("input",{type:"range",min:h,max:d,step:u,value:e[c],oninput:m=>{e[c]=Number(m.target.value),p.textContent=f(e[c]),t.saveSettings()}});return b("span",null,g," ",p)},r=(c,h)=>b("select",{onchange:d=>{e[c]=d.target.value,t.saveSettings()}},...h.map(([d,u])=>b("option",{value:d,selected:e[c]===d},u))),o=c=>b("input",{type:"checkbox",checked:e[c],onchange:h=>{e[c]=h.target.checked,t.saveSettings()}}),a=b("div",null,n("\u0420\u043E\u0437\u043C\u0456\u0440 \u0431\u0438\u0442\u0432\u0438 (\u0432\u043E\u0457\u043D\u0456\u0432 \u043D\u0430 \u043F\u043E\u043B\u0456)",i("battleSize",20,150,10)),n("\u0427\u0443\u0442\u043B\u0438\u0432\u0456\u0441\u0442\u044C \u043C\u0438\u0448\u0456",i("sensitivity",.3,2.5,.1,c=>c.toFixed(1))),n("\u0406\u043D\u0432\u0435\u0440\u0442\u0443\u0432\u0430\u0442\u0438 \u0432\u0456\u0441\u044C Y",o("invertY")),n("\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0438\u0439 \u043D\u0430\u043F\u0440\u044F\u043C \u0431\u043B\u043E\u043A\u0443",o("autoBlock")),n("\u0428\u043A\u043E\u0434\u0430, \u044F\u043A\u0443 \u043E\u0442\u0440\u0438\u043C\u0443\u0454 \u0433\u0440\u0430\u0432\u0435\u0446\u044C",i("playerDamage",.25,1,.25,c=>`${Math.round(c*100)}%`)),n("\u0413\u0440\u0430\u0444\u0456\u043A\u0430 \u0431\u0438\u0442\u0432",r("graphics",[["low","\u041D\u0438\u0437\u044C\u043A\u0430 (\u0448\u0432\u0438\u0434\u043A\u043E)"],["medium","\u0421\u0435\u0440\u0435\u0434\u043D\u044F"],["high","\u0412\u0438\u0441\u043E\u043A\u0430"]])),n("\u0422\u0456\u043D\u0456 \u0432 \u0431\u0438\u0442\u0432\u0430\u0445",o("shadows")),n("\u0420\u043E\u0437\u0434\u0456\u043B\u044C\u043D\u0456\u0441\u0442\u044C \u0443 \u0431\u0438\u0442\u0432\u0430\u0445",i("quality",.5,1,.25,c=>`${Math.round(c*100)}%`)),n("\u0413\u0443\u0447\u043D\u0456\u0441\u0442\u044C",i("volume",0,1,.05,c=>`${Math.round(c*100)}%`)),n("\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u0447\u0430\u0441\u0443 \u043D\u0430 \u043C\u0430\u043F\u0456",i("mapSpeed",.5,3,.25,c=>`\xD7${c}`))),l=this.windows.show({title:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",body:a,cls:"narrow",footer:[bt("\u0413\u043E\u0442\u043E\u0432\u043E",()=>this.windows.close(l),"primary")]})}openHelp(){let t=(i,r)=>b("div",null,...i.split(" ").map(o=>b("kbd",null,o))," \u2014 ",r),e=b("div",null,b("div",{class:"section-title"},"\u041A\u0430\u0440\u0442\u0430 \u0441\u0432\u0456\u0442\u0443"),b("div",{class:"keys"},t("\u041B\u041A\u041C","\u0440\u0443\u0445 / \u0446\u0456\u043B\u044C (\u043C\u0456\u0441\u0442\u043E, \u0437\u0430\u0433\u0456\u043D, \u0431\u0438\u0442\u0432\u0430)"),t("\u041F\u0435\u0440\u0435\u0442\u044F\u0433\u0443\u0432\u0430\u043D\u043D\u044F","\u0440\u0443\u0445 \u043A\u0430\u043C\u0435\u0440\u0438"),t("\u041A\u043E\u043B\u0456\u0449\u0430\u0442\u043A\u043E","\u043C\u0430\u0441\u0448\u0442\u0430\u0431"),t("\u041F\u0440\u043E\u0431\u0456\u043B","\u0447\u0435\u043A\u0430\u0442\u0438 (\u0447\u0430\u0441 \u0456\u0434\u0435)"),t("P","\u0437\u0430\u0433\u0456\u043D"),t("C","\u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436"),t("I","\u0441\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F"),t("J","\u0436\u0443\u0440\u043D\u0430\u043B \u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F"),t("F","\u0444\u0440\u0430\u043A\u0446\u0456\u0457"),t("Esc","\u043C\u0435\u043D\u044E")),b("div",{class:"section-title"},"\u0411\u0438\u0442\u0432\u0430"),b("div",{class:"keys"},t("W A S D","\u0440\u0443\u0445 (\u0432\u0435\u0440\u0445\u0438: A/D \u2014 \u043F\u043E\u0432\u043E\u0440\u043E\u0442)"),t("\u041C\u0438\u0448\u0430","\u043E\u0433\u043B\u044F\u0434 \u0456 \u043D\u0430\u043F\u0440\u044F\u043C \u0443\u0434\u0430\u0440\u0443"),t("\u041B\u041A\u041C","\u0443\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u2014 \u0437\u0430\u043C\u0430\u0445, \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u2014 \u0443\u0434\u0430\u0440"),t("\u041F\u041A\u041C","\u0431\u043B\u043E\u043A (\u0449\u0438\u0442 \u0430\u0431\u043E \u0437\u0431\u0440\u043E\u044F)"),t("Q \u041A\u043E\u043B\u0456\u0449\u0430\u0442\u043A\u043E","\u0437\u043C\u0456\u043D\u0438\u0442\u0438 \u0437\u0431\u0440\u043E\u044E"),t("Shift","\u0445\u043E\u0434\u044C\u0431\u0430 / \u043F\u043E\u0432\u0456\u043B\u044C\u043D\u0438\u0439 \u043A\u0456\u043D\u044C"),t("F","\u0437\u0456\u0441\u043A\u043E\u0447\u0438\u0442\u0438 \u0437 \u043A\u043E\u043D\u044F / \u0441\u0456\u0441\u0442\u0438 \u043D\u0430 \u043A\u043E\u043D\u044F \u043F\u043E\u0440\u0443\u0447"),t("1 2 3 0","\u0432\u0438\u0431\u0456\u0440: \u043F\u0456\u0445\u043E\u0442\u0430 / \u0441\u0442\u0440\u0456\u043B\u044C\u0446\u0456 / \u043A\u0456\u043D\u043D\u043E\u0442\u0430 / \u0443\u0441\u0456"),t("Z","\u043D\u0430\u043A\u0430\u0437: \u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E \u0442\u0443\u0442"),t("X","\u043D\u0430\u043A\u0430\u0437: \u0437\u0430 \u043C\u043D\u043E\u044E"),t("C","\u043D\u0430\u043A\u0430\u0437: \u0432 \u0430\u0442\u0430\u043A\u0443!"),t("V","\u043D\u0430\u043A\u0430\u0437: \u0441\u0442\u0440\u0456\u043B\u044F\u0442\u0438 / \u043D\u0435 \u0441\u0442\u0440\u0456\u043B\u044F\u0442\u0438"),t("Tab","\u0432\u0456\u0434\u0441\u0442\u0443\u043F\u0438\u0442\u0438 / \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0431\u0438\u0442\u0432\u0443"),t("Esc","\u043F\u0430\u0443\u0437\u0430")),b("div",{class:"section-title"},"\u041D\u0430\u043F\u0440\u044F\u043C\u043A\u043E\u0432\u0438\u0439 \u0431\u0456\u0439"),b("p",null,"\u041D\u0430\u043F\u0440\u044F\u043C \u0443\u0434\u0430\u0440\u0443 \u0432\u0438\u0437\u043D\u0430\u0447\u0430\u0454 \u043E\u0441\u0442\u0430\u043D\u043D\u0456\u0439 \u0440\u0443\u0445 \u043C\u0438\u0448\u0456: \u0432\u043B\u0456\u0432\u043E, \u0432\u043F\u0440\u0430\u0432\u043E, \u0432\u0433\u043E\u0440\u0443 (\u0443\u0434\u0430\u0440 \u0437\u0433\u043E\u0440\u0438) \u0447\u0438 \u0432\u043D\u0438\u0437 (\u0443\u043A\u043E\u043B). \u0421\u0442\u0440\u0456\u043B\u043A\u0430 \u0431\u0456\u043B\u044F \u043F\u0440\u0438\u0446\u0456\u043B\u0443 \u043F\u043E\u043A\u0430\u0437\u0443\u0454 \u0432\u0438\u0431\u0440\u0430\u043D\u0438\u0439 \u043D\u0430\u043F\u0440\u044F\u043C. \u0429\u043E\u0431 \u0437\u0430\u0431\u043B\u043E\u043A\u0443\u0432\u0430\u0442\u0438 \u0443\u0434\u0430\u0440 \u0431\u0435\u0437 \u0449\u0438\u0442\u0430, \u0443\u0442\u0440\u0438\u043C\u0443\u0439\u0442\u0435 \u041F\u041A\u041C, \u0440\u0443\u0445\u0430\u044E\u0447\u0438 \u043C\u0438\u0448\u0443 \u0432 \u0431\u0456\u043A, \u0437\u0432\u0456\u0434\u043A\u0438 \u043B\u0435\u0442\u0438\u0442\u044C \u0443\u0434\u0430\u0440 (\u0447\u0435\u0440\u0432\u043E\u043D\u0430 \u0441\u0442\u0440\u0456\u043B\u043A\u0430). \u0429\u0438\u0442 \u0431\u043B\u043E\u043A\u0443\u0454 \u0432\u0441\u0456 \u0443\u0434\u0430\u0440\u0438 \u0441\u043F\u0435\u0440\u0435\u0434\u0443. \u0423\u0442\u0440\u0438\u043C\u0443\u0439\u0442\u0435 \u0443\u0434\u0430\u0440 \u0434\u043E\u0432\u0448\u0435 \u2014 \u0432\u0456\u043D \u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0438\u0439. \u0412\u0435\u0440\u0445\u0438 \u0448\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u043A\u043E\u043D\u044F \u0434\u043E\u0434\u0430\u0454 \u0448\u043A\u043E\u0434\u0438!"),b("div",{class:"section-title"},"\u041F\u043E\u0440\u0430\u0434\u0438"),b("ul",null,b("li",null,"\u041D\u0430\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0434\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456\u0432 \u0443 \u0441\u0435\u043B\u0430\u0445 \u0456 \u0442\u0440\u0435\u043D\u0443\u0439\u0442\u0435 \u0457\u0445 \u0443 \u0431\u043E\u044F\u0445 \u2014 \u0434\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0456 \u0432\u043E\u0457\u043D\u0438 \u043F\u043E\u043A\u0440\u0430\u0449\u0443\u044E\u0442\u044C\u0441\u044F \u0443 \u0432\u0456\u043A\u043D\u0456 \u0437\u0430\u0433\u043E\u043D\u0443."),b("li",null,"\u041A\u0443\u043F\u0443\u0439\u0442\u0435 \u0442\u043E\u0432\u0430\u0440\u0438 \u0442\u0430\u043C, \u0434\u0435 \u0457\u0445 \u0432\u0438\u0440\u043E\u0431\u043B\u044F\u044E\u0442\u044C (\u0446\u0456\u043D\u0430 \u0437\u0435\u043B\u0435\u043D\u0430), \u0456 \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0442\u0430\u043C, \u0434\u0435 \u043D\u0430 \u043D\u0438\u0445 \u043F\u043E\u043F\u0438\u0442."),b("li",null,"\u0421\u043B\u0456\u0434\u043A\u0443\u0439\u0442\u0435 \u0437\u0430 \u043F\u0440\u043E\u0432\u0456\u0437\u0456\u0454\u044E \u0442\u0430 \u043F\u043B\u0430\u0442\u043D\u0435\u044E \u2014 \u0433\u043E\u043B\u043E\u0434\u043D\u0438\u0439 \u0456 \u043D\u0435\u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0438\u0439 \u0437\u0430\u0433\u0456\u043D \u0440\u043E\u0437\u0431\u0456\u0436\u0438\u0442\u044C\u0441\u044F."),b("li",null,"\u0421\u0442\u0430\u043D\u044C\u0442\u0435 \u043D\u0430\u0439\u043C\u0430\u043D\u0446\u0435\u043C \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u0430 \u0432 \u0442\u0440\u043E\u043D\u043D\u0456\u0439 \u0437\u0430\u043B\u0456 \u043C\u0456\u0441\u0442\u0430, \u0430 \u0437 \u0447\u0430\u0441\u043E\u043C \u2014 \u0432\u0430\u0441\u0430\u043B\u043E\u043C \u0456 \u0432\u043B\u0430\u0441\u043D\u0438\u043A\u043E\u043C \u0437\u0430\u043C\u043A\u0456\u0432."),b("li",null,"\u041D\u0435\u0437\u0430\u043B\u0435\u0436\u043D\u0438\u0439 \u0448\u043B\u044F\u0445: \u0437\u0430\u0445\u043E\u043F\u0456\u0442\u044C \u0437\u0430\u043C\u043E\u043A \u0441\u0430\u043C\u0456 \u2014 \u0456 \u0437\u0430\u0441\u043D\u0443\u0439\u0442\u0435 \u0432\u043B\u0430\u0441\u043D\u0435 \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u043E."))),n=this.windows.show({title:"\u042F\u043A \u0433\u0440\u0430\u0442\u0438",body:e,footer:[bt("\u0417\u0440\u043E\u0437\u0443\u043C\u0456\u043B\u043E",()=>this.windows.close(n),"primary")]})}openSaveLoad(t){let e=this.game,n,i=()=>{let r=e.listSaves(),o=b("table",{class:"list"},b("tr",null,b("th",null,"\u0421\u043B\u043E\u0442"),b("th",null,"\u0413\u0435\u0440\u043E\u0439"),b("th",null,"\u0414\u0435\u043D\u044C"),b("th",null,"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E"),b("th",null,"")));for(let l of r){if(!t&&!l.info||t&&l.slot==="auto")continue;let c=l.info;o.append(b("tr",null,b("td",null,l.slot==="auto"?"\u0410\u0432\u0442\u043E\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F":`\u0421\u043B\u043E\u0442 ${l.slot}`),b("td",null,c?`${c.name} (\u0440\u0456\u0432\u0435\u043D\u044C ${c.level})`:b("span",{class:"muted"},"\u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E")),b("td",null,c?c.day:""),b("td",null,c?new Date(c.savedAt).toLocaleString("uk-UA"):""),b("td",{class:"num"},t?bt("\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0441\u044E\u0434\u0438",()=>{e.saveGame(l.slot),this.toast("\u0413\u0440\u0443 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E"),i()},"small"):bt("\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438",()=>{this.windows.closeAll(),e.loadGame(l.slot)},"small primary"),c?bt("\u2715",()=>{confirm("\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F?")&&(e.deleteSave(l.slot),i())},"small danger",{title:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438"}):null)))}let a=b("div",null,o,!t&&!r.some(l=>l.info)?b("p",{class:"muted"},"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u044C \u043F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454."):null);n?this.windows.update(n,{body:a}):n=this.windows.show({title:t?"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0433\u0440\u0443":"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0433\u0440\u0443",body:a,footer:[bt("\u0417\u0430\u043A\u0440\u0438\u0442\u0438",()=>this.windows.close(n))]})};i()}openGameMenu(){let t=this.game,e=this.windows.show({title:"\u041C\u0435\u043D\u044E",cls:"narrow",body:b("div",{class:"menu-list",style:{width:"100%"}},bt("\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F \u0434\u043E \u0433\u0440\u0438",()=>this.windows.close(e),"primary"),bt("\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0433\u0440\u0443",()=>this.openSaveLoad(!0)),bt("\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0433\u0440\u0443",()=>this.openSaveLoad(!1)),bt("\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",()=>this.openSettings()),bt("\u042F\u043A \u0433\u0440\u0430\u0442\u0438",()=>this.openHelp()),bt("\u0412\u0438\u0439\u0442\u0438 \u0432 \u0433\u043E\u043B\u043E\u0432\u043D\u0435 \u043C\u0435\u043D\u044E",()=>{confirm("\u0412\u0438\u0439\u0442\u0438 \u0432 \u0433\u043E\u043B\u043E\u0432\u043D\u0435 \u043C\u0435\u043D\u044E? \u041D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441 \u0431\u0443\u0434\u0435 \u0432\u0442\u0440\u0430\u0447\u0435\u043D\u043E (\u0454 \u0430\u0432\u0442\u043E\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F).")&&t.quitToMenu()},"danger"))})}};Object.assign(Kr.prototype,yf,vf,_f);var Fa=class{constructor(t,e){this.game=t,this.root=b("div",{class:"map-hud"}),e.append(this.root),this.top=b("div",{class:"hud-top"}),this.left=b("div",{class:"hud-left"},this.sideBtn("\u2694 \u0417\u0430\u0433\u0456\u043D","P",()=>t.ui.openParty()),this.sideBtn("\u263A \u041F\u0435\u0440\u0441\u043E\u043D\u0430\u0436","C",()=>t.ui.openCharacter()),this.sideBtn("\u2692 \u0421\u043F\u043E\u0440\u044F\u0434\u0436\u0435\u043D\u043D\u044F","I",()=>t.ui.openInventory()),this.sideBtn("\u2709 \u0416\u0443\u0440\u043D\u0430\u043B","J",()=>t.ui.openJournal()),this.sideBtn("\u2691 \u0424\u0440\u0430\u043A\u0446\u0456\u0457","F",()=>t.ui.openFactions()),this.sideBtn("\u2630 \u041C\u0435\u043D\u044E","Esc",()=>t.ui.openGameMenu())),this.waitBtn=bt("\u23F3 \u0427\u0435\u043A\u0430\u0442\u0438",()=>t.toggleWait(),"small"),this.speedBtns=[1,2,4].map(n=>bt(`\xD7${n}`,()=>t.setSpeed(n),"small")),this.status=b("div",{class:"status"},""),this.time=b("div",{class:"hud-time"},b("div",{class:"row"},this.waitBtn,...this.speedBtns),this.status,bt("\u25CE \u0414\u043E \u0437\u0430\u0433\u043E\u043D\u0443",()=>t.map.centerOnPlayer(),"small")),this.log=b("div",{class:"log"}),this.tooltip=b("div",{class:"tooltip",style:{display:"none"}}),this.root.append(this.top,this.left,this.time,this.log,this.tooltip),this.entries=[],this.lastTop=""}sideBtn(t,e,n){return b("button",{class:"btn",onclick:n},t,b("span",{class:"key"},e))}show(t){this.root.style.display=t?"":"none"}pushLog(t,e="info"){let n=b("div",{class:`entry ${e}`},t);for(this.log.append(n),this.entries.push({el:n,t:performance.now()});this.entries.length>7;)this.entries.shift().el.remove()}update(){let t=this.game,e=t.world;if(!e)return;let n=e.state,i=n.player,{day:r,text:o}=_a(n.time),a=e.carryFood(),l=de(n.party.troops)+1,c=Math.floor(a/Math.max(1,Math.ceil(l/3))),h=e.playerMorale(),d=Vi(n.party.troops),u=`
      <div class="stat">\u0414\u0435\u043D\u044C <b>${r}</b> \xB7 ${o}${e.isNight()?" \u263E":" \u2600"}</div>
      <div class="stat">\u0417\u043E\u043B\u043E\u0442\u043E <b>${i.gold}</b></div>
      <div class="stat">\u0417\u0430\u0433\u0456\u043D <b>${de(n.party.troops)+1+e.companionCount()}</b>/${e.partyLimit()+1}${d?` <span style="color:#f99">(${d} \u043F\u043E\u0440.)</span>`:""}</div>
      <div class="stat">\u041F\u0440\u043E\u0432\u0456\u0437\u0456\u044F <b>${a}</b> (${c} ${Fi(c,"\u0434\u0435\u043D\u044C","\u0434\u043D\u0456","\u0434\u043D\u0456\u0432")})</div>
      <div class="stat">\u041C\u043E\u0440\u0430\u043B\u044C <b>${h}</b></div>
      <div class="stat">\u0417\u0434\u043E\u0440\u043E\u0432'\u044F <b>${Math.round(i.hp)}</b>/${Wn(i)}</div>`;u!==this.lastTop&&(this.top.innerHTML=u,this.lastTop=u);let f=e.playerMoving();this.status.textContent=f?"\u0417\u0430\u0433\u0456\u043D \u0443 \u0434\u043E\u0440\u043E\u0437\u0456\u2026":t.waiting?"\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F\u2026":"\u041F\u0430\u0443\u0437\u0430 \u2014 \u043A\u043B\u0430\u0446\u043D\u0456\u0442\u044C \u043F\u043E \u043C\u0430\u043F\u0456",this.waitBtn.classList.toggle("active",t.waiting),this.speedBtns.forEach((g,m)=>g.classList.toggle("active",t.speed===[1,2,4][m]));let p=performance.now();for(let g of this.entries){let m=p-g.t;g.el.style.opacity=m>9e3?"0":"1"}this.updateTooltip()}updateTooltip(){let t=this.game,e=t.map.hover,n=this.tooltip;if(!e||t.ui.windows.open){n.style.display="none";return}let i=t.world,r="";if(e.type==="settlement"){let c=e.e,h=He(c.faction),d={town:"\u041C\u0456\u0441\u0442\u043E",castle:"\u0417\u0430\u043C\u043E\u043A",village:"\u0421\u0435\u043B\u043E"}[c.kind],u=c.owner==="player"?"\u0432\u0438":c.owner?i.lById.get(c.owner)?.name:"\u2014";r=`<div class="t-title">${c.name}</div>${d} \xB7 <span style="color:${h.color}">\u25A0</span> ${h.name}<br>\u0412\u043B\u0430\u0441\u043D\u0438\u043A: ${u}`,c.kind!=="village"&&(r+=`<br>\u0413\u0430\u0440\u043D\u0456\u0437\u043E\u043D: ~${L0(de(c.garrison))}`),c.siege&&(r+='<br><span style="color:#f77">\u0412 \u043E\u0431\u043B\u043E\u0437\u0456!</span>'),i.isHostile(c.faction,"player")&&(r+='<br><span style="color:#f77">\u0412\u043E\u0440\u043E\u0436\u0430 \u0442\u0435\u0440\u0438\u0442\u043E\u0440\u0456\u044F</span>')}else if(e.type==="party"){let c=e.e,h=He(c.faction),d=de(c.troops),u=i.strength(c)/Math.max(1,i.strength(i.state.party)),f=u>1.6?"\u0437\u043D\u0430\u0447\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0456 \u0437\u0430 \u0432\u0430\u0441":u>1.1?"\u0441\u0438\u043B\u044C\u043D\u0456\u0448\u0456 \u0437\u0430 \u0432\u0430\u0441":u>.8?"\u0440\u0456\u0432\u043D\u0456 \u0432\u0430\u043C":u>.5?"\u0441\u043B\u0430\u0431\u0448\u0456 \u0437\u0430 \u0432\u0430\u0441":"\u0437\u043D\u0430\u0447\u043D\u043E \u0441\u043B\u0430\u0431\u0448\u0456",p=i.isHostile(c.faction,"player");r=`<div class="t-title">${c.name}</div><span style="color:${h.color}">\u25A0</span> ${h.name}<br>\u0412\u043E\u0457\u043D\u0456\u0432: ${d} \u2014 ${f}<br><span class="muted">${Xs(c.troops,3)}</span>`,r+=`<br>${p?'<span style="color:#f77">\u0412\u043E\u0440\u043E\u0436\u0456 \u0434\u043E \u0432\u0430\u0441</span>':'<span style="color:#9e9">\u041D\u0435 \u0432\u043E\u0440\u043E\u0436\u0456</span>'}`,r+=`<br><span class="muted">${D0(c)}</span>`}else if(e.type==="battle"){let h=e.e.sides.map(d=>d.map(u=>i.pById.get(u)?.name).filter(Boolean).join(", "));r=`<div class="t-title">\u0411\u0438\u0442\u0432\u0430</div>${h[0]}<br>\u043F\u0440\u043E\u0442\u0438<br>${h[1]}<br><span class="muted">\u041A\u043B\u0430\u0446\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u0442\u0438\u0441\u044F</span>`}else e.type==="player"&&(r=`<div class="t-title">${i.state.player.name}</div>\u0412\u0430\u0448 \u0437\u0430\u0433\u0456\u043D: ${de(i.state.party.troops)+1}<br><span class="muted">${Xs(i.state.party.troops,4)}</span>`);n.innerHTML=r,n.style.display="block";let o=t.map.mouse.x,a=t.map.mouse.y,l=n.offsetWidth;n.style.left=`${Math.min(window.innerWidth-l-8,o+16)}px`,n.style.top=`${Math.min(window.innerHeight-n.offsetHeight-8,a+16)}px`}};function L0(s){return s<10?s:Math.round(s/10)*10}function D0(s){switch(s.ai?.mode){case"hunt":return"\u041F\u0435\u0440\u0435\u0441\u043B\u0456\u0434\u0443\u0454 \u0432\u043E\u0440\u043E\u0433\u0430";case"flee":return"\u0422\u0456\u043A\u0430\u0454";case"siege":return s.ai.besieging?"\u0422\u0440\u0438\u043C\u0430\u0454 \u043E\u0431\u043B\u043E\u0433\u0443":"\u0419\u0434\u0435 \u0432 \u043F\u043E\u0445\u0456\u0434";case"patrol":return"\u041F\u0430\u0442\u0440\u0443\u043B\u044E\u0454";case"return":return"\u041F\u043E\u0432\u0435\u0440\u0442\u0430\u0454\u0442\u044C\u0441\u044F \u0434\u043E\u0434\u043E\u043C\u0443";case"defend":return"\u041F\u043E\u0441\u043F\u0456\u0448\u0430\u0454 \u043D\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u0443";case"travel":return"\u041F\u0440\u044F\u043C\u0443\u0454 \u0434\u043E \u043C\u0456\u0441\u0442\u0430";case"roam":return"\u0411\u043B\u0443\u043A\u0430\u0454 \u043E\u043A\u043E\u043B\u0438\u0446\u044F\u043C\u0438";default:return"\u0412\u0456\u0434\u043F\u043E\u0447\u0438\u0432\u0430\u0454"}}var Oa=class{constructor(t){this.settings=t,this.ctx=null,this.noiseBuf=null,this.last={}}ensure(){if(this.ctx)return this.ctx;let t=window.AudioContext||window.webkitAudioContext;if(!t)return null;this.ctx=new t;let e=this.ctx.sampleRate*1;this.noiseBuf=this.ctx.createBuffer(1,e,this.ctx.sampleRate);let n=this.noiseBuf.getChannelData(0);for(let i=0;i<e;i++)n[i]=Math.random()*2-1;return this.ctx}resume(){let t=this.ensure();t&&t.state==="suspended"&&t.resume()}gain(t){return t*(this.settings.volume??.6)}allow(t,e){let n=performance.now();return this.last[t]&&n-this.last[t]<e?!1:(this.last[t]=n,!0)}noise(t,e,n,i,r="bandpass",o=0,a=0){let l=this.ensure();if(!l||this.gain(1)<=0)return;let c=l.currentTime+o,h=l.createBufferSource();h.buffer=this.noiseBuf;let d=l.createBiquadFilter();d.type=r,d.frequency.value=e,d.Q.value=n;let u=l.createGain();u.gain.setValueAtTime(this.gain(i),c),u.gain.exponentialRampToValueAtTime(1e-4,c+t);let f=u;if(l.createStereoPanner&&a){let p=l.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,a)),u.connect(p),f=p}h.connect(d).connect(u),f.connect(l.destination),h.start(c,Math.random()*.5),h.stop(c+t+.05)}tone(t,e,n,i="sine",r=0,o=0){let a=this.ensure();if(!a||this.gain(1)<=0)return;let l=a.currentTime+r,c=a.createOscillator();c.type=i,c.frequency.setValueAtTime(t,l),o&&c.frequency.exponentialRampToValueAtTime(Math.max(20,t*o),l+e);let h=a.createGain();h.gain.setValueAtTime(this.gain(n),l),h.gain.exponentialRampToValueAtTime(1e-4,l+e),c.connect(h).connect(a.destination),c.start(l),c.stop(l+e+.05)}att(t){return 1/(1+(t||0)*.08)}clang(t=0){if(!this.allow("clang",40))return;let e=this.att(t);this.noise(.08,3200,3,.5*e,"bandpass");let n=900+Math.random()*500;this.tone(n,.35,.12*e,"triangle"),this.tone(n*2.7,.25,.06*e,"sine")}woodBlock(t=0){if(!this.allow("wood",40))return;let e=this.att(t);this.noise(.12,500,2,.6*e,"bandpass"),this.tone(180,.12,.2*e,"sine",0,.6)}hit(t=0,e=!1){if(!this.allow("hit",30))return;let n=this.att(t);this.noise(e?.22:.14,e?450:700,1.2,.8*n,"lowpass"),this.tone(e?90:120,.15,.25*n,"sine",0,.5)}swing(t=0){if(!this.allow("swing",60))return;let e=this.att(t);this.noise(.22,1400,.8,.18*e,"bandpass")}bowRelease(t=0){if(!this.allow("bow",30))return;let e=this.att(t);this.tone(220,.12,.15*e,"triangle",0,.7),this.noise(.1,2500,1,.12*e,"highpass")}arrowHit(t=0){this.allow("ahit",30)&&this.noise(.06,1800,1.5,.35*this.att(t),"bandpass")}hoof(t=0){this.noise(.05,300+Math.random()*120,3,.18*this.att(t),"bandpass")}grunt(t=0){if(!this.allow("grunt",120))return;let e=this.att(t),n=110+Math.random()*60;this.tone(n,.25,.12*e,"sawtooth",0,.7),this.noise(.2,600,1,.1*e,"lowpass")}horn(){this.tone(196,1.1,.18,"sawtooth",0,1),this.tone(294,.9,.1,"sawtooth",.15,1)}cheer(){for(let t=0;t<6;t++)this.noise(.6,900+t*150,.8,.1,"bandpass",t*.05)}ui(){this.tone(660,.06,.05,"sine")}};var jf=0,Ad=1,Qf=2;var Rs=1,tp=2,Tr=3,ts=0,Je=1,On=2,We=0,Er=1,Cd=2,Rd=3,Pd=4,Yl=5;var Bn=100,ep=101,np=102,ip=103,sp=104,Ps=200,rp=201,op=202,ap=203,Id=204,Ld=205,Vo=206,lp=207,Go=208,cp=209,hp=210,dp=211,up=212,fp=213,pp=214,dl=0,ul=1,fl=2,ur=3,pl=4,ml=5,gl=6,yl=7,Zl=0,mp=1,gp=2,Qn=0,Wo=1,$o=2,Xo=3,Is=4,qo=5,Yo=6,Zo=7;var Dd=300,es=301,Ls=302,Kl=303,Jl=304,Ko=306,Pn=1e3,ai=1001,xl=1002,Ve=1003,yp=1004;var Jo=1005;var on=1006,jl=1007;var ns=1008;var pn=1009,Nd=1010,Ud=1011,Ar=1012,Ql=1013,ti=1014,zn=1015,sn=1016,tc=1017,ec=1018,is=1020,kd=35902,Fd=35899,Od=1021,Bd=1022,bn=1023,li=1026,ui=1027,nc=1028,ic=1029,ss=1030,sc=1031;var rc=1033,jo=33776,Qo=33777,ta=33778,ea=33779,oc=35840,ac=35841,lc=35842,cc=35843,hc=36196,dc=37492,uc=37496,fc=37488,pc=37489,na=37490,mc=37491,gc=37808,yc=37809,xc=37810,vc=37811,_c=37812,Mc=37813,wc=37814,bc=37815,Sc=37816,Tc=37817,Ec=37818,Ac=37819,Cc=37820,Rc=37821,Pc=36492,Ic=36494,Lc=36495,Dc=36283,Nc=36284,ia=36285,Uc=36286;var ao=2300,vl=2301,cl=2302,md=2303,gd=2400,yd=2401,xd=2402;var xp=3200;var Cr=0,vp=1,Ii="",xn="srgb",lo="srgb-linear",co="linear",ye="srgb";var hl=7680;var _p=519,Mp=512,wp=513,bp=514,kc=515,Sp=516,Tp=517,Fc=518,Ep=519,Ap=35044;var zd="300 es",Jn=2e3,fr=2001;function N0(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function U0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function ho(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Cp(){let s=ho("canvas");return s.style.display="block",s}var Mf={},pr=null;function Hd(...s){let t="THREE."+s.shift();pr?pr("log",t,...s):console.log(t,...s)}function Rp(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Xt(...s){s=Rp(s);let t="THREE."+s.shift();if(pr)pr("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function qt(...s){s=Rp(s);let t="THREE."+s.shift();if(pr)pr("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Ms(...s){let t=s.join(" ");t in Mf||(Mf[t]=!0,Xt(...s))}function Pp(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Ip={[dl]:ul,[fl]:gl,[pl]:yl,[ur]:ml,[ul]:dl,[gl]:fl,[yl]:pl,[ml]:ur},ci=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Gh=Math.PI/180,_l=180/Math.PI;function Rr(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[s&255]+dn[s>>8&255]+dn[s>>16&255]+dn[s>>24&255]+"-"+dn[t&255]+dn[t>>8&255]+"-"+dn[t>>16&15|64]+dn[t>>24&255]+"-"+dn[e&63|128]+dn[e>>8&255]+"-"+dn[e>>16&255]+dn[e>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function le(s,t,e){return Math.max(t,Math.min(e,s))}function k0(s,t){return(s%t+t)%t}function Wh(s,t,e){return(1-e)*s+e*t}function Jr(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function wn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var qd=class qd{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};qd.prototype.isVector2=!0;var ht=qd,an=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[o+0],f=r[o+1],p=r[o+2],g=r[o+3];if(d!==g||l!==u||c!==f||h!==p){let m=l*u+c*f+h*p+d*g;m<0&&(u=-u,f=-f,p=-p,g=-g,m=-m);let y=1-a;if(m<.9995){let x=Math.acos(m),M=Math.sin(x);y=Math.sin(y*x)/M,a=Math.sin(a*x)/M,l=l*y+u*a,c=c*y+f*a,h=h*y+p*a,d=d*y+g*a}else{l=l*y+u*a,c=c*y+f*a,h=h*y+p*a,d=d*y+g*a;let x=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=x,c*=x,h*=x,d*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-a*f,t[e+2]=c*p+h*f+a*u-l*d,t[e+3]=h*p-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:Xt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Yd=class Yd{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(wf.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return $h.copy(this).projectOnVector(t),this.sub($h)}reflect(t){return this.sub($h.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Yd.prototype.isVector3=!0;var L=Yd,$h=new L,wf=new an,Zd=class Zd{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],g=i[0],m=i[3],y=i[6],x=i[1],M=i[4],v=i[7],S=i[2],T=i[5],C=i[8];return r[0]=o*g+a*x+l*S,r[3]=o*m+a*M+l*T,r[6]=o*y+a*v+l*C,r[1]=c*g+h*x+d*S,r[4]=c*m+h*M+d*T,r[7]=c*y+h*v+d*C,r[2]=u*g+f*x+p*S,r[5]=u*m+f*M+p*T,r[8]=u*y+f*v+p*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,p=e*d+n*u+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/p;return t[0]=d*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*o)*g,t[3]=u*g,t[4]=(h*e-i*l)*g,t[5]=(i*r-a*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ms("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xh.makeScale(t,e)),this}rotate(t){return Ms("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xh.makeRotation(-t)),this}translate(t,e){return Ms("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xh.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Zd.prototype.isMatrix3=!0;var jt=Zd,Xh=new jt,bf=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sf=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function F0(){let s={enabled:!0,workingColorSpace:lo,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ye&&(i.r=Ti(i.r),i.g=Ti(i.g),i.b=Ti(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ye&&(i.r=dr(i.r),i.g=dr(i.g),i.b=dr(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ii?co:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ms("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ms("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[lo]:{primaries:t,whitePoint:n,transfer:co,toXYZ:bf,fromXYZ:Sf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:t,whitePoint:n,transfer:ye,toXYZ:bf,fromXYZ:Sf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}}),s}var se=F0();function Ti(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function dr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Js,Ml=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Js===void 0&&(Js=ho("canvas")),Js.width=t.width,Js.height=t.height;let i=Js.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Js}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ho("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ti(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ti(e[n]/255)*255):e[n]=Ti(e[n]);return{data:e,width:t.width,height:t.height}}else return Xt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},O0=0,mr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:O0++}),this.uuid=Rr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(qh(i[o].image)):r.push(qh(i[o]))}else r=qh(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function qh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ml.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Xt("Texture: Unable to serialize Texture."),{})}var B0=0,Yh=new L,vn=class s extends ci{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=ai,i=ai,r=on,o=ns,a=bn,l=pn,c=s.DEFAULT_ANISOTROPY,h=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=Rr(),this.name="",this.source=new mr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Yh).x}get height(){return this.source.getSize(Yh).y}get depth(){return this.source.getSize(Yh).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Xt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Xt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Dd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Pn:t.x=t.x-Math.floor(t.x);break;case ai:t.x=t.x<0?0:1;break;case xl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Pn:t.y=t.y-Math.floor(t.y);break;case ai:t.y=t.y<0?0:1;break;case xl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=Dd;vn.DEFAULT_ANISOTROPY=1;var Kd=class Kd{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],g=l[2],m=l[6],y=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+y-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(c+1)/2,v=(f+1)/2,S=(y+1)/2,T=(h+u)/4,C=(d+g)/4,_=(p+m)/4;return M>v&&M>S?M<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(M),i=T/n,r=C/n):v>S?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=T/i,r=_/i):S<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(S),n=C/r,i=_/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-p)*(m-p)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(d-g)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+y-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Kd.prototype.isVector4=!0;var Ue=Kd,wl=class extends ci{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},r=new vn(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new mr(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ge=class extends wl{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},uo=class extends vn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var bl=class extends vn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var ql=class ql{constructor(t,e,n,i,r,o,a,l,c,h,d,u,f,p,g,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,u,f,p,g,m)}set(t,e,n,i,r,o,a,l,c,h,d,u,f,p,g,m){let y=this.elements;return y[0]=t,y[4]=e,y[8]=n,y[12]=i,y[1]=r,y[5]=o,y[9]=a,y[13]=l,y[2]=c,y[6]=h,y[10]=d,y[14]=u,y[3]=f,y[7]=p,y[11]=g,y[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ql().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/js.setFromMatrixColumn(t,0).length(),r=1/js.setFromMatrixColumn(t,1).length(),o=1/js.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u+g*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=g+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u-g*a,e[4]=-o*d,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=g-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=g-u*d,e[8]=p*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-g*d}else if(t.order==="XZY"){let u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=o*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=a*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(z0,t,H0)}lookAt(t,e,n){let i=this.elements;return Cn.subVectors(t,e),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),Wi.crossVectors(n,Cn),Wi.lengthSq()===0&&(Math.abs(n.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),Wi.crossVectors(n,Cn)),Wi.normalize(),Ba.crossVectors(Cn,Wi),i[0]=Wi.x,i[4]=Ba.x,i[8]=Cn.x,i[1]=Wi.y,i[5]=Ba.y,i[9]=Cn.y,i[2]=Wi.z,i[6]=Ba.z,i[10]=Cn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],g=n[6],m=n[10],y=n[14],x=n[3],M=n[7],v=n[11],S=n[15],T=i[0],C=i[4],_=i[8],A=i[12],R=i[1],I=i[5],D=i[9],O=i[13],N=i[2],z=i[6],q=i[10],$=i[14],it=i[3],W=i[7],j=i[11],Q=i[15];return r[0]=o*T+a*R+l*N+c*it,r[4]=o*C+a*I+l*z+c*W,r[8]=o*_+a*D+l*q+c*j,r[12]=o*A+a*O+l*$+c*Q,r[1]=h*T+d*R+u*N+f*it,r[5]=h*C+d*I+u*z+f*W,r[9]=h*_+d*D+u*q+f*j,r[13]=h*A+d*O+u*$+f*Q,r[2]=p*T+g*R+m*N+y*it,r[6]=p*C+g*I+m*z+y*W,r[10]=p*_+g*D+m*q+y*j,r[14]=p*A+g*O+m*$+y*Q,r[3]=x*T+M*R+v*N+S*it,r[7]=x*C+M*I+v*z+S*W,r[11]=x*_+M*D+v*q+S*j,r[15]=x*A+M*O+v*$+S*Q,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],g=t[7],m=t[11],y=t[15],x=l*f-c*u,M=a*f-c*d,v=a*u-l*d,S=o*f-c*h,T=o*u-l*h,C=o*d-a*h;return e*(g*x-m*M+y*v)-n*(p*x-m*S+y*T)+i*(p*M-g*S+y*C)-r*(p*v-g*T+m*C)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],g=t[13],m=t[14],y=t[15],x=e*a-n*o,M=e*l-i*o,v=e*c-r*o,S=n*l-i*a,T=n*c-r*a,C=i*c-r*l,_=h*g-d*p,A=h*m-u*p,R=h*y-f*p,I=d*m-u*g,D=d*y-f*g,O=u*y-f*m,N=x*O-M*D+v*I+S*R-T*A+C*_;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/N;return t[0]=(a*O-l*D+c*I)*z,t[1]=(i*D-n*O-r*I)*z,t[2]=(g*C-m*T+y*S)*z,t[3]=(u*T-d*C-f*S)*z,t[4]=(l*R-o*O-c*A)*z,t[5]=(e*O-i*R+r*A)*z,t[6]=(m*v-p*C-y*M)*z,t[7]=(h*C-u*v+f*M)*z,t[8]=(o*D-a*R+c*_)*z,t[9]=(n*R-e*D-r*_)*z,t[10]=(p*T-g*v+y*x)*z,t[11]=(d*v-h*T-f*x)*z,t[12]=(a*A-o*I-l*_)*z,t[13]=(e*I-n*A+i*_)*z,t[14]=(g*M-p*S-m*x)*z,t[15]=(h*S-d*M+u*x)*z,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,p=r*d,g=o*h,m=o*d,y=a*d,x=l*c,M=l*h,v=l*d,S=n.x,T=n.y,C=n.z;return i[0]=(1-(g+y))*S,i[1]=(f+v)*S,i[2]=(p-M)*S,i[3]=0,i[4]=(f-v)*T,i[5]=(1-(u+y))*T,i[6]=(m+x)*T,i[7]=0,i[8]=(p+M)*C,i[9]=(m-x)*C,i[10]=(1-(u+g))*C,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=js.set(i[0],i[1],i[2]).length(),a=js.set(i[4],i[5],i[6]).length(),l=js.set(i[8],i[9],i[10]).length();r<0&&(o=-o),qn.copy(this);let c=1/o,h=1/a,d=1/l;return qn.elements[0]*=c,qn.elements[1]*=c,qn.elements[2]*=c,qn.elements[4]*=h,qn.elements[5]*=h,qn.elements[6]*=h,qn.elements[8]*=d,qn.elements[9]*=d,qn.elements[10]*=d,e.setFromRotationMatrix(qn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=Jn,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),p,g;if(l)p=r/(o-r),g=o*r/(o-r);else if(a===Jn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===fr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Jn,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),p,g;if(l)p=1/(o-r),g=o/(o-r);else if(a===Jn)p=-2/(o-r),g=-(o+r)/(o-r);else if(a===fr)p=-1/(o-r),g=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};ql.prototype.isMatrix4=!0;var ce=ql,js=new L,qn=new ce,z0=new L(0,0,0),H0=new L(1,1,1),Wi=new L,Ba=new L,Cn=new L,Tf=new ce,Ef=new an,Fn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Xt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Tf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Tf,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ef.setFromEuler(this),this.setFromQuaternion(Ef,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fn.DEFAULT_ORDER="XYZ";var fo=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},V0=0,Af=new L,Qs=new an,_i=new ce,za=new L,jr=new L,G0=new L,W0=new an,Cf=new L(1,0,0),Rf=new L(0,1,0),Pf=new L(0,0,1),If={type:"added"},$0={type:"removed"},tr={type:"childadded",child:null},Zh={type:"childremoved",child:null},qe=class s extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:V0++}),this.uuid=Rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new L,e=new Fn,n=new an,i=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ce},normalMatrix:{value:new jt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qs.setFromAxisAngle(t,e),this.quaternion.multiply(Qs),this}rotateOnWorldAxis(t,e){return Qs.setFromAxisAngle(t,e),this.quaternion.premultiply(Qs),this}rotateX(t){return this.rotateOnAxis(Cf,t)}rotateY(t){return this.rotateOnAxis(Rf,t)}rotateZ(t){return this.rotateOnAxis(Pf,t)}translateOnAxis(t,e){return Af.copy(t).applyQuaternion(this.quaternion),this.position.add(Af.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cf,t)}translateY(t){return this.translateOnAxis(Rf,t)}translateZ(t){return this.translateOnAxis(Pf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(_i.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?za.copy(t):za.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),jr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_i.lookAt(jr,za,this.up):_i.lookAt(za,jr,this.up),this.quaternion.setFromRotationMatrix(_i),i&&(_i.extractRotation(i.matrixWorld),Qs.setFromRotationMatrix(_i),this.quaternion.premultiply(Qs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(qt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(If),tr.child=t,this.dispatchEvent(tr),tr.child=null):qt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($0),Zh.child=t,this.dispatchEvent(Zh),Zh.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),_i.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),_i.multiply(t.parent.matrixWorld)),t.applyMatrix4(_i),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(If),tr.child=t,this.dispatchEvent(tr),tr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jr,t,G0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jr,W0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};qe.DEFAULT_UP=new L(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Pe=class extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},X0={type:"move"},gr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let g of t.hand.values()){let m=e.getJointPose(g,n),y=this._getHandJoint(c,g);m!==null&&(y.matrix.fromArray(m.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=m.radius),y.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(X0)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Pe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Lp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},Ha={h:0,s:0,l:0};function Kh(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var St=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=se.workingColorSpace){if(t=k0(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Kh(o,r,t+1/3),this.g=Kh(o,r,t),this.b=Kh(o,r,t-1/3)}return se.colorSpaceToWorking(this,i),this}setStyle(t,e=xn){function n(r){r!==void 0&&parseFloat(r)<1&&Xt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Xt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Xt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xn){let n=Lp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Xt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ti(t.r),this.g=Ti(t.g),this.b=Ti(t.b),this}copyLinearToSRGB(t){return this.r=dr(t.r),this.g=dr(t.g),this.b=dr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xn){return se.workingToColorSpace(un.copy(this),t),Math.round(le(un.r*255,0,255))*65536+Math.round(le(un.g*255,0,255))*256+Math.round(le(un.b*255,0,255))}getHexString(t=xn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(un.copy(this),e);let n=un.r,i=un.g,r=un.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(un.copy(this),e),t.r=un.r,t.g=un.g,t.b=un.b,t}getStyle(t=xn){se.workingToColorSpace(un.copy(this),t);let e=un.r,n=un.g,i=un.b;return t!==xn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL($i),this.setHSL($i.h+t,$i.s+e,$i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($i),t.getHSL(Ha);let n=Wh($i.h,Ha.h,e),i=Wh($i.s,Ha.s,e),r=Wh($i.l,Ha.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},un=new St;St.NAMES=Lp;var po=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new St(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},mo=class s{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new St(t),this.near=e,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ws=class extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Yn=new L,Mi=new L,Jh=new L,wi=new L,er=new L,nr=new L,Lf=new L,jh=new L,Qh=new L,td=new L,ed=new Ue,nd=new Ue,id=new Ue,Zi=class s{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Yn.subVectors(t,e),i.cross(Yn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Yn.subVectors(i,e),Mi.subVectors(n,e),Jh.subVectors(t,e);let o=Yn.dot(Yn),a=Yn.dot(Mi),l=Yn.dot(Jh),c=Mi.dot(Mi),h=Mi.dot(Jh),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,wi)===null?!1:wi.x>=0&&wi.y>=0&&wi.x+wi.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wi.x),l.addScaledVector(o,wi.y),l.addScaledVector(a,wi.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return ed.setScalar(0),nd.setScalar(0),id.setScalar(0),ed.fromBufferAttribute(t,e),nd.fromBufferAttribute(t,n),id.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(ed,r.x),o.addScaledVector(nd,r.y),o.addScaledVector(id,r.z),o}static isFrontFacing(t,e,n,i){return Yn.subVectors(n,e),Mi.subVectors(t,e),Yn.cross(Mi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Yn.subVectors(this.c,this.b),Mi.subVectors(this.a,this.b),Yn.cross(Mi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;er.subVectors(i,n),nr.subVectors(r,n),jh.subVectors(t,n);let l=er.dot(jh),c=nr.dot(jh);if(l<=0&&c<=0)return e.copy(n);Qh.subVectors(t,i);let h=er.dot(Qh),d=nr.dot(Qh);if(h>=0&&d<=h)return e.copy(i);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(er,o);td.subVectors(t,r);let f=er.dot(td),p=nr.dot(td);if(p>=0&&f<=p)return e.copy(r);let g=f*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(nr,a);let m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return Lf.subVectors(r,i),a=(d-h)/(d-h+(f-p)),e.copy(i).addScaledVector(Lf,a);let y=1/(m+g+u);return o=g*y,a=u*y,e.copy(n).addScaledVector(er,o).addScaledVector(nr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},hi=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Zn):Zn.fromBufferAttribute(r,o),Zn.applyMatrix4(t.matrixWorld),this.expandByPoint(Zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Va.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Va.copy(n.boundingBox)),Va.applyMatrix4(t.matrixWorld),this.union(Va)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Zn),Zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qr),Ga.subVectors(this.max,Qr),ir.subVectors(t.a,Qr),sr.subVectors(t.b,Qr),rr.subVectors(t.c,Qr),Xi.subVectors(sr,ir),qi.subVectors(rr,sr),gs.subVectors(ir,rr);let e=[0,-Xi.z,Xi.y,0,-qi.z,qi.y,0,-gs.z,gs.y,Xi.z,0,-Xi.x,qi.z,0,-qi.x,gs.z,0,-gs.x,-Xi.y,Xi.x,0,-qi.y,qi.x,0,-gs.y,gs.x,0];return!sd(e,ir,sr,rr,Ga)||(e=[1,0,0,0,1,0,0,0,1],!sd(e,ir,sr,rr,Ga))?!1:(Wa.crossVectors(Xi,qi),e=[Wa.x,Wa.y,Wa.z],sd(e,ir,sr,rr,Ga))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},bi=[new L,new L,new L,new L,new L,new L,new L,new L],Zn=new L,Va=new hi,ir=new L,sr=new L,rr=new L,Xi=new L,qi=new L,gs=new L,Qr=new L,Ga=new L,Wa=new L,ys=new L;function sd(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ys.fromArray(s,r);let a=i.x*Math.abs(ys.x)+i.y*Math.abs(ys.y)+i.z*Math.abs(ys.z),l=t.dot(ys),c=e.dot(ys),h=n.dot(ys);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Xe=new L,$a=new ht,q0=0,en=class extends ci{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:q0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ap,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)$a.fromBufferAttribute(this,e),$a.applyMatrix3(t),this.setXY(e,$a.x,$a.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.applyMatrix3(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.applyMatrix4(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.applyNormalMatrix(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.transformDirection(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Jr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=wn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Jr(e,this.array)),e}setX(t,e){return this.normalized&&(e=wn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Jr(e,this.array)),e}setY(t,e){return this.normalized&&(e=wn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Jr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=wn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Jr(e,this.array)),e}setW(t,e){return this.normalized&&(e=wn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=wn(e,this.array),n=wn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=wn(e,this.array),n=wn(n,this.array),i=wn(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=wn(e,this.array),n=wn(n,this.array),i=wn(i,this.array),r=wn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var go=class extends en{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var yo=class extends en{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Kt=class extends en{constructor(t,e,n){super(new Float32Array(t),e,n)}},Y0=new hi,to=new L,rd=new L,Ei=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Y0.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;to.subVectors(t,this.center);let e=to.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(to,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rd.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(to.copy(t.center).add(rd)),this.expandByPoint(to.copy(t.center).sub(rd))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Z0=0,kn=new ce,od=new qe,or=new L,Rn=new hi,eo=new hi,tn=new L,be=class s extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Z0++}),this.uuid=Rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(N0(t)?yo:go)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return kn.makeRotationFromQuaternion(t),this.applyMatrix4(kn),this}rotateX(t){return kn.makeRotationX(t),this.applyMatrix4(kn),this}rotateY(t){return kn.makeRotationY(t),this.applyMatrix4(kn),this}rotateZ(t){return kn.makeRotationZ(t),this.applyMatrix4(kn),this}translate(t,e,n){return kn.makeTranslation(t,e,n),this.applyMatrix4(kn),this}scale(t,e,n){return kn.makeScale(t,e,n),this.applyMatrix4(kn),this}lookAt(t){return od.lookAt(t),od.updateMatrix(),this.applyMatrix4(od.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(or).negate(),this.translate(or.x,or.y,or.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Kt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Xt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(tn.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(tn),tn.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(tn)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ei);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){qt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];eo.setFromBufferAttribute(a),this.morphTargetsRelative?(tn.addVectors(Rn.min,eo.min),Rn.expandByPoint(tn),tn.addVectors(Rn.max,eo.max),Rn.expandByPoint(tn)):(Rn.expandByPoint(eo.min),Rn.expandByPoint(eo.max))}Rn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)tn.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(tn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)tn.fromBufferAttribute(a,c),l&&(or.fromBufferAttribute(t,c),tn.add(or)),i=Math.max(i,n.distanceToSquared(tn))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&qt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){qt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new en(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new L,l[_]=new L;let c=new L,h=new L,d=new L,u=new ht,f=new ht,p=new ht,g=new L,m=new L;function y(_,A,R){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,R),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,R),h.sub(c),d.sub(c),f.sub(u),p.sub(u);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(I),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(I),a[_].add(g),a[A].add(g),a[R].add(g),l[_].add(m),l[A].add(m),l[R].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let _=0,A=x.length;_<A;++_){let R=x[_],I=R.start,D=R.count;for(let O=I,N=I+D;O<N;O+=3)y(t.getX(O+0),t.getX(O+1),t.getX(O+2))}let M=new L,v=new L,S=new L,T=new L;function C(_){S.fromBufferAttribute(i,_),T.copy(S);let A=a[_];M.copy(A),M.sub(S.multiplyScalar(S.dot(A))).normalize(),v.crossVectors(T,A);let I=v.dot(l[_])<0?-1:1;o.setXYZW(_,M.x,M.y,M.z,I)}for(let _=0,A=x.length;_<A;++_){let R=x[_],I=R.start,D=R.count;for(let O=I,N=I+D;O<N;O+=3)C(t.getX(O+0)),C(t.getX(O+1)),C(t.getX(O+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new en(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,d=new L;if(t)for(let u=0,f=t.count;u<f;u+=3){let p=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)tn.fromBufferAttribute(t,e),tn.normalize(),t.setXYZ(e,tn.x,tn.y,tn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,p=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*h;for(let y=0;y<h;y++)u[p++]=c[f++]}return new en(u,h,d)}if(this.index===null)return Xt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var ad=new L,K0=new L,J0=new jt,Kn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=ad.subVectors(n,e).cross(K0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(ad),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||J0.getNormalMatrix(t),i=this.coplanarPoint(ad).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},j0=0,jn=class extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=Rr(),this.name="",this.type="Material",this.blending=Er,this.side=ts,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Id,this.blendDst=Ld,this.blendEquation=Bn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_p,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hl,this.stencilZFail=hl,this.stencilZPass=hl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Xt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Xt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new St().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Kn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ht().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Si=new L,ld=new L,Xa=new L,qa=new L,xo=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Si.copy(this.origin).addScaledVector(this.direction,e),Si.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ld.copy(t).add(e).multiplyScalar(.5),Xa.copy(e).sub(t).normalize(),qa.copy(this.origin).sub(ld);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Xa),a=qa.dot(this.direction),l=-qa.dot(Xa),c=qa.lengthSq(),h=Math.abs(1-o*o),d,u,f,p;if(h>0)if(d=o*l-a,u=o*a-l,p=r*h,d>=0)if(u>=-p)if(u<=p){let g=1/h;d*=g,u*=g,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ld).addScaledVector(Xa,u),f}intersectSphere(t,e){if(t.radius<0)return null;Si.subVectors(t.center,this.origin);let n=Si.dot(this.direction),i=Si.dot(Si)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Si)!==null}intersectTriangle(t,e,n,i,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,p=e.x-o.x,g=e.y-o.y,m=e.z-o.z,y=n.x-o.x,x=n.y-o.y,M=n.z-o.z,v=Math.abs(l),S=Math.abs(c),T=Math.abs(h),C,_,A,R,I,D,O,N,z,q,$,it;if(v>=S&&v>=T?(A=l,D=d,z=p,it=y,l>=0?(C=c,_=h,R=u,I=f,O=g,N=m,q=x,$=M):(C=h,_=c,R=f,I=u,O=m,N=g,q=M,$=x)):S>=T?(A=c,D=u,z=g,it=x,c>=0?(C=h,_=l,R=f,I=d,O=m,N=p,q=M,$=y):(C=l,_=h,R=d,I=f,O=p,N=m,q=y,$=M)):(A=h,D=f,z=m,it=M,h>=0?(C=l,_=c,R=d,I=u,O=p,N=g,q=y,$=x):(C=c,_=l,R=u,I=d,O=g,N=p,q=x,$=y)),A===0)return null;let W=C/A,j=_/A,Q=1/A,Rt=R-W*D,At=I-j*D,he=O-W*z,Qt=N-j*z,ie=q-W*it,Y=$-j*it,J=ie*Qt-Y*he,ut=Rt*Y-At*ie,Ft=he*At-Qt*Rt;if(i){if(J<0||ut<0||Ft<0)return null}else if((J<0||ut<0||Ft<0)&&(J>0||ut>0||Ft>0))return null;let Tt=J+ut+Ft;if(Tt===0)return null;let Wt=Q*(J*D+ut*z+Ft*it);return(Tt>0?Wt<0:Wt>0)?null:this.at(Wt/Tt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vo=class extends jn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Df=new ce,xs=new xo,Ya=new Ei,Nf=new L,Za=new L,Ka=new L,Ja=new L,cd=new L,ja=new L,Uf=new L,Qa=new L,ge=class extends qe{constructor(t=new be,e=new vo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){ja.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(cd.fromBufferAttribute(d,t),o?ja.addScaledVector(cd,h):ja.addScaledVector(cd.sub(e),h))}e.add(ja)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ya.copy(n.boundingSphere),Ya.applyMatrix4(r),xs.copy(t.ray).recast(t.near),!(Ya.containsPoint(xs.origin)===!1&&(xs.intersectSphere(Ya,Nf)===null||xs.origin.distanceToSquared(Nf)>(t.far-t.near)**2))&&(Df.copy(r).invert(),xs.copy(t.ray).applyMatrix4(Df),!(n.boundingBox!==null&&xs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,xs)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){let m=u[p],y=o[m.materialIndex],x=Math.max(m.start,f.start),M=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,S=M;v<S;v+=3){let T=a.getX(v),C=a.getX(v+1),_=a.getX(v+2);i=tl(this,y,t,n,c,h,d,T,C,_),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let m=p,y=g;m<y;m+=3){let x=a.getX(m),M=a.getX(m+1),v=a.getX(m+2);i=tl(this,o,t,n,c,h,d,x,M,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){let m=u[p],y=o[m.materialIndex],x=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,S=M;v<S;v+=3){let T=v,C=v+1,_=v+2;i=tl(this,y,t,n,c,h,d,T,C,_),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let m=p,y=g;m<y;m+=3){let x=m,M=m+1,v=m+2;i=tl(this,o,t,n,c,h,d,x,M,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function Q0(s,t,e,n,i,r,o,a){let l;if(t.side===Je?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===ts,a),l===null)return null;Qa.copy(a),Qa.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(Qa);return c<e.near||c>e.far?null:{distance:c,point:Qa.clone(),object:s}}function tl(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Za),s.getVertexPosition(l,Ka),s.getVertexPosition(c,Ja);let h=Q0(s,t,e,n,Za,Ka,Ja,Uf);if(h){let d=new L;Zi.getBarycoord(Uf,Za,Ka,Ja,d),i&&(h.uv=Zi.getInterpolatedAttribute(i,a,l,c,d,new ht)),r&&(h.uv1=Zi.getInterpolatedAttribute(r,a,l,c,d,new ht)),o&&(h.normal=Zi.getInterpolatedAttribute(o,a,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new L,materialIndex:0};Zi.getNormal(Za,Ka,Ja,u.normal),h.face=u,h.barycoord=d}return h}var Ai=class extends vn{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Ve,h=Ve,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _o=class extends en{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ar=new ce,kf=new ce,el=[],Ff=new hi,tg=new ce,no=new ge,io=new Ei,Mo=class extends ge{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new _o(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,tg)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new hi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ar),Ff.copy(t.boundingBox).applyMatrix4(ar),this.boundingBox.union(Ff)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ei),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ar),io.copy(t.boundingSphere).applyMatrix4(ar),this.boundingSphere.union(io)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(no.geometry=this.geometry,no.material=this.material,no.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),io.copy(this.boundingSphere),io.applyMatrix4(n),t.ray.intersectsSphere(io)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ar),kf.multiplyMatrices(n,ar),no.matrixWorld=kf,no.raycast(t,el);for(let o=0,a=el.length;o<a;o++){let l=el[o];l.instanceId=r,l.object=this,e.push(l)}el.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new _o(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ai(new Float32Array(i*this.count),i,this.count,nc,zn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},vs=new Ei,eg=new ht(.5,.5),nl=new L,yr=class{constructor(t=new Kn,e=new Kn,n=new Kn,i=new Kn,r=new Kn,o=new Kn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Jn,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],g=r[9],m=r[10],y=r[11],x=r[12],M=r[13],v=r[14],S=r[15];if(i[0].setComponents(c-o,f-h,y-p,S-x).normalize(),i[1].setComponents(c+o,f+h,y+p,S+x).normalize(),i[2].setComponents(c+a,f+d,y+g,S+M).normalize(),i[3].setComponents(c-a,f-d,y-g,S-M).normalize(),n)i[4].setComponents(l,u,m,v).normalize(),i[5].setComponents(c-l,f-u,y-m,S-v).normalize();else if(i[4].setComponents(c-l,f-u,y-m,S-v).normalize(),e===Jn)i[5].setComponents(c+l,f+u,y+m,S+v).normalize();else if(e===fr)i[5].setComponents(l,u,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(t){vs.center.set(0,0,0);let e=eg.distanceTo(t.center);return vs.radius=.7071067811865476+e,vs.applyMatrix4(t.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(nl.x=i.normal.x>0?t.max.x:t.min.x,nl.y=i.normal.y>0?t.max.y:t.min.y,nl.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(nl)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xr=class extends jn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Of=new ce,vd=new xo,il=new Ei,sl=new L,wo=class extends qe{constructor(t=new be,e=new xr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),il.copy(n.boundingSphere),il.applyMatrix4(i),il.radius+=r,t.ray.intersectsSphere(il)===!1)return;Of.copy(i).invert(),vd.copy(t.ray).applyMatrix4(Of);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=u,g=f;p<g;p++){let m=c.getX(p);sl.fromBufferAttribute(d,m),Bf(sl,m,l,i,t,e,this)}}else{let u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let p=u,g=f;p<g;p++)sl.fromBufferAttribute(d,p),Bf(sl,p,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Bf(s,t,e,n,i,r,o){let a=vd.distanceSqToPoint(s);if(a<e){let l=new L;vd.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var bo=class extends vn{constructor(t=[],e=es,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},vr=class extends vn{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var di=class extends vn{constructor(t,e,n=ti,i,r,o,a=Ve,l=Ve,c,h=li,d=1){if(h!==li&&h!==ui)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new mr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Sl=class extends di{constructor(t,e=ti,n=es,i,r,o=Ve,a=Ve,l,c=li){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},So=class extends vn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},nn=class s extends be{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(h,3)),this.setAttribute("uv",new Kt(d,2));function p(g,m,y,x,M,v,S,T,C,_,A){let R=v/C,I=S/_,D=v/2,O=S/2,N=T/2,z=C+1,q=_+1,$=0,it=0,W=new L;for(let j=0;j<q;j++){let Q=j*I-O;for(let Rt=0;Rt<z;Rt++){let At=Rt*R-D;W[g]=At*x,W[m]=Q*M,W[y]=N,c.push(W.x,W.y,W.z),W[g]=0,W[m]=0,W[y]=T>0?1:-1,h.push(W.x,W.y,W.z),d.push(Rt/C),d.push(1-j/_),$+=1}}for(let j=0;j<_;j++)for(let Q=0;Q<C;Q++){let Rt=u+Q+z*j,At=u+Q+z*(j+1),he=u+(Q+1)+z*(j+1),Qt=u+(Q+1)+z*j;l.push(Rt,At,Qt),l.push(At,he,Qt),it+=6}a.addGroup(f,it,A),f+=it,u+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},To=class s extends be{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,p=n*2+r,g=i+1,m=new L,y=new L;for(let x=0;x<=p;x++){let M=0,v=0,S=0,T=0;if(x<=n){let A=x/n,R=A*Math.PI/2;v=-h-t*Math.cos(R),S=t*Math.sin(R),T=-t*Math.cos(R),M=A*d}else if(x<=n+r){let A=(x-n)/r;v=-h+A*e,S=t,T=0,M=d+A*u}else{let A=(x-n-r)/n,R=A*Math.PI/2;v=h+t*Math.sin(R),S=t*Math.cos(R),T=t*Math.sin(R),M=d+u+A*d}let C=Math.max(0,Math.min(1,M/f)),_=0;x===0?_=.5/i:x===p&&(_=-.5/i);for(let A=0;A<=i;A++){let R=A/i,I=R*Math.PI*2,D=Math.sin(I),O=Math.cos(I);y.x=-S*O,y.y=v,y.z=S*D,a.push(y.x,y.y,y.z),m.set(-S*O,T,S*D),m.normalize(),l.push(m.x,m.y,m.z),c.push(R+_,C)}if(x>0){let A=(x-1)*g;for(let R=0;R<i;R++){let I=A+R,D=A+R+1,O=x*g+R,N=x*g+R+1;o.push(I,D,O),o.push(D,N,O)}}}this.setIndex(o),this.setAttribute("position",new Kt(a,3)),this.setAttribute("normal",new Kt(l,3)),this.setAttribute("uv",new Kt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var Ci=class s extends be{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],p=0,g=[],m=n/2,y=0;x(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Kt(d,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(f,2));function x(){let v=new L,S=new L,T=0,C=(e-t)/n;for(let _=0;_<=r;_++){let A=[],R=_/r,I=R*(e-t)+t;for(let D=0;D<=i;D++){let O=D/i,N=O*l+a,z=Math.sin(N),q=Math.cos(N);S.x=I*z,S.y=-R*n+m,S.z=I*q,d.push(S.x,S.y,S.z),v.set(z,C,q).normalize(),u.push(v.x,v.y,v.z),f.push(O,1-R),A.push(p++)}g.push(A)}for(let _=0;_<i;_++)for(let A=0;A<r;A++){let R=g[A][_],I=g[A+1][_],D=g[A+1][_+1],O=g[A][_+1];(t>0||A!==0)&&(h.push(R,I,O),T+=3),(e>0||A!==r-1)&&(h.push(I,D,O),T+=3)}c.addGroup(y,T,0),y+=T}function M(v){let S=p,T=new ht,C=new L,_=0,A=v===!0?t:e,R=v===!0?1:-1;for(let D=1;D<=i;D++)d.push(0,m*R,0),u.push(0,R,0),f.push(.5,.5),p++;let I=p;for(let D=0;D<=i;D++){let N=D/i*l+a,z=Math.cos(N),q=Math.sin(N);C.x=A*q,C.y=m*R,C.z=A*z,d.push(C.x,C.y,C.z),u.push(0,R,0),T.x=z*.5+.5,T.y=q*.5*R+.5,f.push(T.x,T.y),p++}for(let D=0;D<i;D++){let O=S+D,N=I+D;v===!0?h.push(N,N+1,O):h.push(N+1,N,O),_+=3}c.addGroup(y,_,v===!0?1:2),y+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ri=class s extends Ci{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Tl=class s extends be{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Kt(r,3)),this.setAttribute("normal",new Kt(r.slice(),3)),this.setAttribute("uv",new Kt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let M=new L,v=new L,S=new L;for(let T=0;T<e.length;T+=3)f(e[T+0],M),f(e[T+1],v),f(e[T+2],S),l(M,v,S,x)}function l(x,M,v,S){let T=S+1,C=[];for(let _=0;_<=T;_++){C[_]=[];let A=x.clone().lerp(v,_/T),R=M.clone().lerp(v,_/T),I=T-_;for(let D=0;D<=I;D++)D===0&&_===T?C[_][D]=A:C[_][D]=A.clone().lerp(R,D/I)}for(let _=0;_<T;_++)for(let A=0;A<2*(T-_)-1;A++){let R=Math.floor(A/2);A%2===0?(u(C[_][R+1]),u(C[_+1][R]),u(C[_][R])):(u(C[_][R+1]),u(C[_+1][R+1]),u(C[_+1][R]))}}function c(x){let M=new L;for(let v=0;v<r.length;v+=3)M.x=r[v+0],M.y=r[v+1],M.z=r[v+2],M.normalize().multiplyScalar(x),r[v+0]=M.x,r[v+1]=M.y,r[v+2]=M.z}function h(){let x=new L;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let v=m(x)/2/Math.PI+.5,S=y(x)/Math.PI+.5;o.push(v,1-S)}p(),d()}function d(){for(let x=0;x<o.length;x+=6){let M=o[x+0],v=o[x+2],S=o[x+4],T=Math.max(M,v,S),C=Math.min(M,v,S);T>.9&&C<.1&&(M<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),S<.2&&(o[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function f(x,M){let v=x*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function p(){let x=new L,M=new L,v=new L,S=new L,T=new ht,C=new ht,_=new ht;for(let A=0,R=0;A<r.length;A+=9,R+=6){x.set(r[A+0],r[A+1],r[A+2]),M.set(r[A+3],r[A+4],r[A+5]),v.set(r[A+6],r[A+7],r[A+8]),T.set(o[R+0],o[R+1]),C.set(o[R+2],o[R+3]),_.set(o[R+4],o[R+5]),S.copy(x).add(M).add(v).divideScalar(3);let I=m(S);g(T,R+0,x,I),g(C,R+2,M,I),g(_,R+4,v,I)}}function g(x,M,v,S){S<0&&x.x===1&&(o[M]=x.x-1),v.x===0&&v.z===0&&(o[M]=S/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function y(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var In=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Xt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(o-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ht:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,i=[],r=[],o=[],a=new L,l=new ce;for(let f=0;f<=t;f++){let p=f/t;i[f]=this.getTangentAt(p,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(le(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(le(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},_r=class extends In{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ht){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},El=class extends _r{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Vd(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,i(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var zf=new L,Hf=new L,hd=new Vd,dd=new Vd,ud=new Vd,Al=class extends In{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new L){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(Hf.subVectors(i[0],i[1]).add(i[0]),c=Hf);let d=i[a%r],u=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(zf.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=zf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),hd.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,g,m),dd.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,g,m),ud.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,g,m)}else this.curveType==="catmullrom"&&(hd.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),dd.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),ud.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(hd.calc(l),dd.calc(l),ud.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new L().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Vf(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function ng(s,t){let e=1-s;return e*e*t}function ig(s,t){return 2*(1-s)*s*t}function sg(s,t){return s*s*t}function ro(s,t,e,n){return ng(s,t)+ig(s,e)+sg(s,n)}function rg(s,t){let e=1-s;return e*e*e*t}function og(s,t){let e=1-s;return 3*e*e*s*t}function ag(s,t){return 3*(1-s)*s*s*t}function lg(s,t){return s*s*s*t}function oo(s,t,e,n,i){return rg(s,t)+og(s,e)+ag(s,n)+lg(s,i)}var Eo=class extends In{constructor(t=new ht,e=new ht,n=new ht,i=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ht){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(oo(t,i.x,r.x,o.x,a.x),oo(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Cl=class extends In{constructor(t=new L,e=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new L){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(oo(t,i.x,r.x,o.x,a.x),oo(t,i.y,r.y,o.y,a.y),oo(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ao=class extends In{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Rl=class extends In{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Co=class extends In{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(ro(t,i.x,r.x,o.x),ro(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Pl=class extends In{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(ro(t,i.x,r.x,o.x),ro(t,i.y,r.y,o.y),ro(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ro=class extends In{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],d=i[o>i.length-3?i.length-1:o+2];return n.set(Vf(a,l.x,c.x,h.x,d.x),Vf(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new ht().fromArray(i))}return this}},_d=Object.freeze({__proto__:null,ArcCurve:El,CatmullRomCurve3:Al,CubicBezierCurve:Eo,CubicBezierCurve3:Cl,EllipseCurve:_r,LineCurve:Ao,LineCurve3:Rl,QuadraticBezierCurve:Co,QuadraticBezierCurve3:Pl,SplineCurve:Ro}),Il=class extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _d[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new _d[i.type]().fromJSON(i))}return this}},Po=class extends Il{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ao(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new Co(this.currentPoint.clone(),new ht(t,e),new ht(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new Eo(this.currentPoint.clone(),new ht(t,e),new ht(n,i),new ht(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ro(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){let c=new _r(t,e,n,i,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Mr=class extends Po{constructor(t){super(t),this.uuid=Rr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Po().fromJSON(i))}return this}};function cg(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Dp(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=pg(s,t,r,e)),s.length>80*e){a=s[0],l=s[1];let h=a,d=l;for(let u=e;u<i;u+=e){let f=s[u],p=s[u+1];f<a&&(a=f),p<l&&(l=p),f>h&&(h=f),p>d&&(d=p)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Io(r,o,e,a,l,c,0),o}function Dp(s,t,e,n,i){let r;if(i===Tg(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=Gf(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Gf(o/n|0,s[o],s[o+1],r);return r&&wr(r,r.next)&&(Do(r),r=r.next),r}function bs(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(wr(e,e.next)||Fe(e.prev,e,e.next)===0)){if(Do(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Io(s,t,e,n,i,r,o){if(!s)return;!o&&r&&vg(s,n,i,r);let a=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?dg(s,n,i,r):hg(s)){t.push(l.i,s.i,c.i),Do(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=ug(bs(s),t),Io(s,t,e,n,i,r,2)):o===2&&fg(s,t,e,n,i,r):Io(bs(s),t,e,n,i,r,1);break}}}function hg(s){let t=s.prev,e=s,n=s.next;if(Fe(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),d=Math.min(a,l,c),u=Math.max(i,r,o),f=Math.max(a,l,c),p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&so(i,a,r,l,o,c,p.x,p.y)&&Fe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function dg(s,t,e,n){let i=s.prev,r=s,o=s.next;if(Fe(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,d=r.y,u=o.y,f=Math.min(a,l,c),p=Math.min(h,d,u),g=Math.max(a,l,c),m=Math.max(h,d,u),y=Md(f,p,t,e,n),x=Md(g,m,t,e,n),M=s.prevZ,v=s.nextZ;for(;M&&M.z>=y&&v&&v.z<=x;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==i&&M!==o&&so(a,h,l,d,c,u,M.x,M.y)&&Fe(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=f&&v.x<=g&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&so(a,h,l,d,c,u,v.x,v.y)&&Fe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=y;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==i&&M!==o&&so(a,h,l,d,c,u,M.x,M.y)&&Fe(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=x;){if(v.x>=f&&v.x<=g&&v.y>=p&&v.y<=m&&v!==i&&v!==o&&so(a,h,l,d,c,u,v.x,v.y)&&Fe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function ug(s,t){let e=s;do{let n=e.prev,i=e.next.next;!wr(n,i)&&Up(n,e,e.next,i)&&Lo(n,i)&&Lo(i,n)&&(t.push(n.i,e.i,i.i),Do(e),Do(e.next),e=s=i),e=e.next}while(e!==s);return bs(e)}function fg(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&wg(o,a)){let l=kp(o,a);o=bs(o,o.next),l=bs(l,l.next),Io(o,t,e,n,i,r,0),Io(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function pg(s,t,e,n){let i=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Dp(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Mg(c))}i.sort(mg);for(let r=0;r<i.length;r++)e=gg(i[r],e);return e}function mg(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function gg(s,t){let e=yg(s,t);if(!e)return t;let n=kp(e,s);return bs(n,n.next),bs(e,e.next)}function yg(s,t){let e=t,n=s.x,i=s.y,r=-1/0,o;if(wr(s,e))return e;do{if(wr(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Np(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);Lo(e,s)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&xg(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function xg(s,t){return Fe(s.prev,s,t.prev)<0&&Fe(t.next,s,s.next)<0}function vg(s,t,e,n){let i=s;do i.z===0&&(i.z=Md(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,_g(i)}function _g(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Md(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Mg(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Np(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function so(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&Np(s,t,e,n,i,r,o,a)}function wg(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!bg(s,t)&&(Lo(s,t)&&Lo(t,s)&&Sg(s,t)&&(Fe(s.prev,s,t.prev)||Fe(s,t.prev,t))||wr(s,t)&&Fe(s.prev,s,s.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function wr(s,t){return s.x===t.x&&s.y===t.y}function Up(s,t,e,n){let i=ol(Fe(s,t,e)),r=ol(Fe(s,t,n)),o=ol(Fe(e,n,s)),a=ol(Fe(e,n,t));return!!(i!==r&&o!==a||i===0&&rl(s,e,t)||r===0&&rl(s,n,t)||o===0&&rl(e,s,n)||a===0&&rl(e,t,n))}function rl(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ol(s){return s>0?1:s<0?-1:0}function bg(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Up(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Lo(s,t){return Fe(s.prev,s,s.next)<0?Fe(s,t,s.next)>=0&&Fe(s,s.prev,t)>=0:Fe(s,t,s.prev)<0||Fe(s,s.next,t)<0}function Sg(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function kp(s,t){let e=wd(s.i,s.x,s.y),n=wd(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Gf(s,t,e,n){let i=wd(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Do(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function wd(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Tg(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var bd=class{static triangulate(t,e,n=2){return cg(t,e,n)}},_s=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Wf(t),$f(n,t);let o=t.length;e.forEach(Wf);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,$f(n,e[l]);let a=bd.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Wf(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function $f(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var br=class s extends be{constructor(t=new Mr([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Kt(i,3)),this.setAttribute("uv",new Kt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,y=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Eg,M,v=!1,S,T,C,_;if(y){M=y.getSpacedPoints(h),v=!0,u=!1;let et=y.isCatmullRomCurve3?y.closed:!1;S=y.computeFrenetFrames(h,et),T=new L,C=new L,_=new L}u||(m=0,f=0,p=0,g=0);let A=a.extractPoints(c),R=A.shape,I=A.holes;if(!_s.isClockWise(R)){R=R.reverse();for(let et=0,rt=I.length;et<rt;et++){let ot=I[et];_s.isClockWise(ot)&&(I[et]=ot.reverse())}}function O(et){let ot=10000000000000001e-36,at=et[0];for(let dt=1;dt<=et.length;dt++){let Vt=dt%et.length,Ot=et[Vt],$t=Ot.x-at.x,Yt=Ot.y-at.y,U=$t*$t+Yt*Yt,ue=Math.max(Math.abs(Ot.x),Math.abs(Ot.y),Math.abs(at.x),Math.abs(at.y)),te=ot*ue*ue;if(U<=te){et.splice(Vt,1),dt--;continue}at=Ot}}O(R),I.forEach(O);let N=I.length,z=R;for(let et=0;et<N;et++){let rt=I[et];R=R.concat(rt)}function q(et,rt,ot){return rt||qt("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(rt,ot)}let $=R.length;function it(et,rt,ot){let at,dt,Vt,Ot=et.x-rt.x,$t=et.y-rt.y,Yt=ot.x-et.x,U=ot.y-et.y,ue=Ot*Ot+$t*$t,te=Ot*U-$t*Yt;if(Math.abs(te)>Number.EPSILON){let P=Math.sqrt(ue),w=Math.sqrt(Yt*Yt+U*U),B=rt.x-$t/P,H=rt.y+Ot/P,Z=ot.x-U/w,ct=ot.y+Yt/w,ft=((Z-B)*U-(ct-H)*Yt)/(Ot*U-$t*Yt);at=B+Ot*ft-et.x,dt=H+$t*ft-et.y;let K=at*at+dt*dt;if(K<=2)return new ht(at,dt);Vt=Math.sqrt(K/2)}else{let P=!1;Ot>Number.EPSILON?Yt>Number.EPSILON&&(P=!0):Ot<-Number.EPSILON?Yt<-Number.EPSILON&&(P=!0):Math.sign($t)===Math.sign(U)&&(P=!0),P?(at=-$t,dt=Ot,Vt=Math.sqrt(ue)):(at=Ot,dt=$t,Vt=Math.sqrt(ue/2))}return new ht(at/Vt,dt/Vt)}let W=[];for(let et=0,rt=z.length,ot=rt-1,at=et+1;et<rt;et++,ot++,at++)ot===rt&&(ot=0),at===rt&&(at=0),W[et]=it(z[et],z[ot],z[at]);let j=[],Q,Rt=W.concat();for(let et=0,rt=N;et<rt;et++){let ot=I[et];Q=[];for(let at=0,dt=ot.length,Vt=dt-1,Ot=at+1;at<dt;at++,Vt++,Ot++)Vt===dt&&(Vt=0),Ot===dt&&(Ot=0),Q[at]=it(ot[at],ot[Vt],ot[Ot]);j.push(Q),Rt=Rt.concat(Q)}let At;if(m===0)At=_s.triangulateShape(z,I);else{let et=[],rt=[];for(let ot=0;ot<m;ot++){let at=ot/m,dt=f*Math.cos(at*Math.PI/2),Vt=p*Math.sin(at*Math.PI/2)+g;for(let Ot=0,$t=z.length;Ot<$t;Ot++){let Yt=q(z[Ot],W[Ot],Vt);ut(Yt.x,Yt.y,-dt),at===0&&et.push(Yt)}for(let Ot=0,$t=N;Ot<$t;Ot++){let Yt=I[Ot];Q=j[Ot];let U=[];for(let ue=0,te=Yt.length;ue<te;ue++){let P=q(Yt[ue],Q[ue],Vt);ut(P.x,P.y,-dt),at===0&&U.push(P)}at===0&&rt.push(U)}}At=_s.triangulateShape(et,rt)}let he=At.length,Qt=p+g;for(let et=0;et<$;et++){let rt=u?q(R[et],Rt[et],Qt):R[et];v?(C.copy(S.normals[0]).multiplyScalar(rt.x),T.copy(S.binormals[0]).multiplyScalar(rt.y),_.copy(M[0]).add(C).add(T),ut(_.x,_.y,_.z)):ut(rt.x,rt.y,0)}for(let et=1;et<=h;et++)for(let rt=0;rt<$;rt++){let ot=u?q(R[rt],Rt[rt],Qt):R[rt];v?(C.copy(S.normals[et]).multiplyScalar(ot.x),T.copy(S.binormals[et]).multiplyScalar(ot.y),_.copy(M[et]).add(C).add(T),ut(_.x,_.y,_.z)):ut(ot.x,ot.y,d/h*et)}for(let et=m-1;et>=0;et--){let rt=et/m,ot=f*Math.cos(rt*Math.PI/2),at=p*Math.sin(rt*Math.PI/2)+g;for(let dt=0,Vt=z.length;dt<Vt;dt++){let Ot=q(z[dt],W[dt],at);ut(Ot.x,Ot.y,d+ot)}for(let dt=0,Vt=I.length;dt<Vt;dt++){let Ot=I[dt];Q=j[dt];for(let $t=0,Yt=Ot.length;$t<Yt;$t++){let U=q(Ot[$t],Q[$t],at);v?ut(U.x,U.y+M[h-1].y,M[h-1].x+ot):ut(U.x,U.y,d+ot)}}}ie(),Y();function ie(){let et=i.length/3;if(u){let rt=0,ot=$*rt;for(let at=0;at<he;at++){let dt=At[at];Ft(dt[2]+ot,dt[1]+ot,dt[0]+ot)}rt=h+m*2,ot=$*rt;for(let at=0;at<he;at++){let dt=At[at];Ft(dt[0]+ot,dt[1]+ot,dt[2]+ot)}}else{for(let rt=0;rt<he;rt++){let ot=At[rt];Ft(ot[2],ot[1],ot[0])}for(let rt=0;rt<he;rt++){let ot=At[rt];Ft(ot[0]+$*h,ot[1]+$*h,ot[2]+$*h)}}n.addGroup(et,i.length/3-et,0)}function Y(){let et=i.length/3,rt=0;J(z,rt),rt+=z.length;for(let ot=0,at=I.length;ot<at;ot++){let dt=I[ot];J(dt,rt),rt+=dt.length}n.addGroup(et,i.length/3-et,1)}function J(et,rt){let ot=et.length;for(;--ot>=0;){let at=ot,dt=ot-1;dt<0&&(dt=et.length-1);for(let Vt=0,Ot=h+m*2;Vt<Ot;Vt++){let $t=$*Vt,Yt=$*(Vt+1),U=rt+at+$t,ue=rt+dt+$t,te=rt+dt+Yt,P=rt+at+Yt;Tt(U,ue,te,P)}}}function ut(et,rt,ot){l.push(et),l.push(rt),l.push(ot)}function Ft(et,rt,ot){Wt(et),Wt(rt),Wt(ot);let at=i.length/3,dt=x.generateTopUV(n,i,at-3,at-2,at-1);pe(dt[0]),pe(dt[1]),pe(dt[2])}function Tt(et,rt,ot,at){Wt(et),Wt(rt),Wt(at),Wt(rt),Wt(ot),Wt(at);let dt=i.length/3,Vt=x.generateSideWallUV(n,i,dt-6,dt-3,dt-2,dt-1);pe(Vt[0]),pe(Vt[1]),pe(Vt[3]),pe(Vt[1]),pe(Vt[2]),pe(Vt[3])}function Wt(et){i.push(l[et*3+0]),i.push(l[et*3+1]),i.push(l[et*3+2])}function pe(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Ag(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new _d[i.type]().fromJSON(i)),new s(n,t.options)}},Eg={generateTopUV:function(s,t,e,n,i){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new ht(r,o),new ht(a,l),new ht(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],p=t[i*3+2],g=t[r*3],m=t[r*3+1],y=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ht(o,1-l),new ht(c,1-d),new ht(u,1-p),new ht(g,1-y)]:[new ht(a,1-l),new ht(h,1-d),new ht(f,1-p),new ht(m,1-y)]}};function Ag(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Ss=class s extends Tl{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Ts=class s extends be{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,f=[],p=[],g=[],m=[];for(let y=0;y<h;y++){let x=y*u-o;for(let M=0;M<c;M++){let v=M*d-r;p.push(v,-x,0),g.push(0,0,1),m.push(M/a),m.push(1-y/l)}}for(let y=0;y<l;y++)for(let x=0;x<a;x++){let M=x+c*y,v=x+c*(y+1),S=x+1+c*(y+1),T=x+1+c*y;f.push(M,v,T),f.push(v,S,T)}this.setIndex(f),this.setAttribute("position",new Kt(p,3)),this.setAttribute("normal",new Kt(g,3)),this.setAttribute("uv",new Kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},No=class s extends be{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],l=[],c=[],h=[],d=t,u=(e-t)/i,f=new L,p=new ht;for(let g=0;g<=i;g++){for(let m=0;m<=n;m++){let y=r+m/n*o;f.x=d*Math.cos(y),f.y=d*Math.sin(y),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}d+=u}for(let g=0;g<i;g++){let m=g*(n+1);for(let y=0;y<n;y++){let x=y+m,M=x,v=x+n+1,S=x+n+2,T=x+1;a.push(M,v,T),a.push(v,S,T)}}this.setIndex(a),this.setAttribute("position",new Kt(l,3)),this.setAttribute("normal",new Kt(c,3)),this.setAttribute("uv",new Kt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Pi=class s extends be{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new L,u=new L,f=[],p=[],g=[],m=[];for(let y=0;y<=n;y++){let x=[],M=y/n,v=o+M*a,S=t*Math.cos(v),T=Math.sqrt(t*t-S*S),C=0;y===0&&o===0?C=.5/e:y===n&&l===Math.PI&&(C=-.5/e);for(let _=0;_<=e;_++){let A=_/e,R=i+A*r;d.x=-T*Math.cos(R),d.y=S,d.z=T*Math.sin(R),p.push(d.x,d.y,d.z),u.copy(d).normalize(),g.push(u.x,u.y,u.z),m.push(A+C,1-M),x.push(c++)}h.push(x)}for(let y=0;y<n;y++)for(let x=0;x<e;x++){let M=h[y][x+1],v=h[y][x],S=h[y+1][x],T=h[y+1][x+1];(y!==0||o>0)&&f.push(M,v,T),(y!==n-1||l<Math.PI)&&f.push(v,S,T)}this.setIndex(f),this.setAttribute("position",new Kt(p,3)),this.setAttribute("normal",new Kt(g,3)),this.setAttribute("uv",new Kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Es=class s extends be{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],d=[],u=new L,f=new L,p=new L;for(let g=0;g<=n;g++){let m=o+g/n*a;for(let y=0;y<=i;y++){let x=y/i*r;f.x=(t+e*Math.cos(m))*Math.cos(x),f.y=(t+e*Math.cos(m))*Math.sin(x),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(y/i),d.push(g/n)}}for(let g=1;g<=n;g++)for(let m=1;m<=i;m++){let y=(i+1)*g+m-1,x=(i+1)*(g-1)+m-1,M=(i+1)*(g-1)+m,v=(i+1)*g+m;l.push(y,x,v),l.push(x,M,v)}this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(h,3)),this.setAttribute("uv",new Kt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Ds(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(Xf(i))i.isRenderTargetTexture?(Xt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Xf(i[0])){let r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function mn(s){let t={};for(let e=0;e<s.length;e++){let n=Ds(s[e]);for(let i in n)t[i]=n[i]}return t}function Xf(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Cg(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Gd(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}var Sn={clone:Ds,merge:mn},Rg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ie=class extends jn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rg,this.fragmentShader=Pg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ds(t.uniforms),this.uniformsGroups=Cg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new St().setHex(i.value);break;case"v2":this.uniforms[n].value=new ht().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ue().fromArray(i.value);break;case"m3":this.uniforms[n].value=new jt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ce().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Sr=class extends Ie{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},As=class extends jn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cr,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Uo=class extends jn{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cr,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},Cs=class extends jn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cr,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Zl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ll=class extends jn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Dl=class extends jn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function lr(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function fd(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Ki=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Nl=class extends Ki{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gd,endingEnd:gd}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case yd:r=t,a=2*e-n;break;case xd:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case yd:o=t,l=2*n-e;break;case xd:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),g=p*p,m=g*p,y=-u*m+2*u*g-u*p,x=(1+u)*m+(-1.5-2*u)*g+(-.5+u)*p+1,M=(-1-f)*m+(1.5+f)*g+.5*p,v=f*m-f*g;for(let S=0;S!==a;++S)r[S]=y*o[h+S]+x*o[c+S]+M*o[l+S]+v*o[d+S];return r}},Ul=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},kl=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Fl=class extends Ki{interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let p=(n-e)/(i-e),g=1-p;for(let m=0;m!==a;++m)r[m]=o[c+m]*g+o[l+m]*p;return r}let u=a*2,f=t-1;for(let p=0;p!==a;++p){let g=o[c+p],m=o[l+p],y=f*u+p*2,x=d[y],M=d[y+1],v=t*u+p*2,S=h[v],T=h[v+1],C=Lg(n,e,x,S,i);r[p]=Fp(C,g,M,T,m)}return r}};function Fp(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function Ig(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function Lg(s,t,e,n,i){let r=(s-t)/(i-t);for(let o=0;o<8;o++){let a=Fp(r,t,e,n,i)-s;if(Math.abs(a)<1e-10)break;let l=Ig(r,t,e,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Ln=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=lr(e,this.TimeBufferType),this.values=lr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:lr(t.times,Array),values:lr(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),fd(t.settings)&&(n.settings={inTangents:lr(t.settings.inTangents,Array),outTangents:lr(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new kl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ul(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Nl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Fl(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case ao:e=this.InterpolantFactoryMethodDiscrete;break;case vl:e=this.InterpolantFactoryMethodLinear;break;case cl:e=this.InterpolantFactoryMethodSmooth;break;case md:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Xt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ao;case this.InterpolantFactoryMethodLinear:return vl;case this.InterpolantFactoryMethodSmooth:return cl;case this.InterpolantFactoryMethodBezier:return md}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;fd(this.settings)&&(qf(this.settings.inTangents,t),qf(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(qt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(qt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){qt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){qt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&U0(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){qt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===cl,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){let g=e[d+p];if(g!==e[u+p]||g!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,fd(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function qf(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}Ln.prototype.ValueTypeName="";Ln.prototype.TimeBufferType=Float32Array;Ln.prototype.ValueBufferType=Float32Array;Ln.prototype.DefaultInterpolation=vl;var Ji=class extends Ln{constructor(t,e,n){super(t,e,n)}};Ji.prototype.ValueTypeName="bool";Ji.prototype.ValueBufferType=Array;Ji.prototype.DefaultInterpolation=ao;Ji.prototype.InterpolantFactoryMethodLinear=void 0;Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Ol=class extends Ln{constructor(t,e,n,i){super(t,e,n,i)}};Ol.prototype.ValueTypeName="color";var Bl=class extends Ln{constructor(t,e,n,i){super(t,e,n,i)}};Bl.prototype.ValueTypeName="number";var zl=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)an.slerpFlat(r,0,o,c-a,o,c,l);return r}},ko=class extends Ln{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new zl(this.times,this.values,this.getValueSize(),t)}};ko.prototype.ValueTypeName="quaternion";ko.prototype.InterpolantFactoryMethodSmooth=void 0;var ji=class extends Ln{constructor(t,e,n){super(t,e,n)}};ji.prototype.ValueTypeName="string";ji.prototype.ValueBufferType=Array;ji.prototype.DefaultInterpolation=ao;ji.prototype.InterpolantFactoryMethodLinear=void 0;ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Hl=class extends Ln{constructor(t,e,n,i){super(t,e,n,i)}};Hl.prototype.ValueTypeName="vector";var Vl=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Op=new Vl,Gl=class{constructor(t){this.manager=t!==void 0?t:Op,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Gl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Fo=class extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new St(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Oo=class extends Fo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},pd=new ce,Yf=new L,Zf=new L,Wl=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yr,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Yf.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yf),Zf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zf),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){pd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(pd,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=i?i.z/r.x:1,a=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===fr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(pd)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},al=new L,ll=new an,oi=new L,Bo=class extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=Jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(al,ll,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(al,ll,oi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(al,ll,oi),oi.x===1&&oi.y===1&&oi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(al,ll,oi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Yi=new L,Kf=new ht,Jf=new ht,fn=class extends Bo{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=_l*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Gh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _l*2*Math.atan(Math.tan(Gh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z)}getViewSize(t,e){return this.getViewBounds(t,Kf,Jf),e.subVectors(Jf,Kf)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Gh*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Qi=class extends Bo{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Sd=class extends Wl{constructor(){super(new Qi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},zo=class extends Fo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new Sd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var cr=-90,hr=1,$l=class extends qe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new fn(cr,hr,t,e);i.layers=this.layers,this.add(i);let r=new fn(cr,hr,t,e);r.layers=this.layers,this.add(r);let o=new fn(cr,hr,t,e);o.layers=this.layers,this.add(o);let a=new fn(cr,hr,t,e);a.layers=this.layers,this.add(a);let l=new fn(cr,hr,t,e);l.layers=this.layers,this.add(l);let c=new fn(cr,hr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===fr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Xl=class extends fn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Ho=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Dg.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Dg(){this._document.hidden===!1&&this.reset()}var Wd="\\[\\]\\.:\\/",Ng=new RegExp("["+Wd+"]","g"),$d="[^"+Wd+"]",Ug="[^"+Wd.replace("\\.","")+"]",kg=/((?:WC+[\/:])*)/.source.replace("WC",$d),Fg=/(WCOD+)?/.source.replace("WCOD",Ug),Og=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$d),Bg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$d),zg=new RegExp("^"+kg+Fg+Og+Bg+"$"),Hg=["material","materials","bones","map"],Td=class{constructor(t,e,n){let i=n||De.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},De=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Ng,"")}static parseTrackName(t){let e=zg.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Hg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Xt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){qt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){qt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){qt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){qt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){qt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){qt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){qt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;qt("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){qt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){qt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};De.Composite=Td;De.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};De.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};De.prototype.GetterByBindingType=[De.prototype._getValue_direct,De.prototype._getValue_array,De.prototype._getValue_arrayElement,De.prototype._getValue_toArray];De.prototype.SetterByBindingTypeAndVersioning=[[De.prototype._setValue_direct,De.prototype._setValue_direct_setNeedsUpdate,De.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[De.prototype._setValue_array,De.prototype._setValue_array_setNeedsUpdate,De.prototype._setValue_array_setMatrixWorldNeedsUpdate],[De.prototype._setValue_arrayElement,De.prototype._setValue_arrayElement_setNeedsUpdate,De.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[De.prototype._setValue_fromArray,De.prototype._setValue_fromArray_setNeedsUpdate,De.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Qb=new Float32Array(1);var Jd=class Jd{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};Jd.prototype.isMatrix2=!0;var Ed=Jd;function Xd(s,t,e,n){let i=Vg(n);switch(e){case Od:return s*t;case nc:return s*t/i.components*i.byteLength;case ic:return s*t/i.components*i.byteLength;case ss:return s*t*2/i.components*i.byteLength;case sc:return s*t*2/i.components*i.byteLength;case Bd:return s*t*3/i.components*i.byteLength;case bn:return s*t*4/i.components*i.byteLength;case rc:return s*t*4/i.components*i.byteLength;case jo:case Qo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ta:case ea:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ac:case cc:return Math.max(s,16)*Math.max(t,8)/4;case oc:case lc:return Math.max(s,8)*Math.max(t,8)/2;case hc:case dc:case fc:case pc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case uc:case na:case mc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case gc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case yc:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case xc:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case vc:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case _c:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Mc:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case wc:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case bc:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Sc:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Tc:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Ec:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Ac:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Cc:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Rc:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Pc:case Ic:case Lc:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Dc:case Nc:return Math.ceil(s/4)*Math.ceil(t/4)*8;case ia:case Uc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Vg(s){switch(s){case pn:case Nd:return{byteLength:1,components:1};case Ar:case Ud:case sn:return{byteLength:2,components:1};case tc:case ec:return{byteLength:2,components:4};case ti:case Ql:case zn:return{byteLength:4,components:1};case kd:case Fd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Xt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function om(){let s=null,t=!1,e=null,n=null;function i(r,o){n=s.requestAnimationFrame(i),e(r,o)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Wg(s){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){let p=d[u],g=d[f];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){let g=d[f];s.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var $g=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Kg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ty=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ey=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ny=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,iy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ry=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,oy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ay=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ly=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,uy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,fy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,py=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,my=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,yy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_y=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,My="gl_FragColor = linearToOutputTexel( gl_FragColor );",wy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,by=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Sy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ty=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ey=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ay=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ry=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Py=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Iy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ly=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ny=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Uy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ky=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Fy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Oy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,By=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gy=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$y=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qy=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Yy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ky=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ex=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ix=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ox=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ax=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ux=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,px=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_x=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Mx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ex=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ax=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Cx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Px=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ix=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ux=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ox=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,$x=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ev=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ov=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,av=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,uv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_v=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ne={alphahash_fragment:$g,alphahash_pars_fragment:Xg,alphamap_fragment:qg,alphamap_pars_fragment:Yg,alphatest_fragment:Zg,alphatest_pars_fragment:Kg,aomap_fragment:Jg,aomap_pars_fragment:jg,batching_pars_vertex:Qg,batching_vertex:ty,begin_vertex:ey,beginnormal_vertex:ny,bsdfs:iy,iridescence_fragment:sy,bumpmap_pars_fragment:ry,clipping_planes_fragment:oy,clipping_planes_pars_fragment:ay,clipping_planes_pars_vertex:ly,clipping_planes_vertex:cy,color_fragment:hy,color_pars_fragment:dy,color_pars_vertex:uy,color_vertex:fy,common:py,cube_uv_reflection_fragment:my,defaultnormal_vertex:gy,displacementmap_pars_vertex:yy,displacementmap_vertex:xy,emissivemap_fragment:vy,emissivemap_pars_fragment:_y,colorspace_fragment:My,colorspace_pars_fragment:wy,envmap_fragment:by,envmap_common_pars_fragment:Sy,envmap_pars_fragment:Ty,envmap_pars_vertex:Ey,envmap_physical_pars_fragment:Fy,envmap_vertex:Ay,fog_vertex:Cy,fog_pars_vertex:Ry,fog_fragment:Py,fog_pars_fragment:Iy,gradientmap_pars_fragment:Ly,lightmap_pars_fragment:Dy,lights_lambert_fragment:Ny,lights_lambert_pars_fragment:Uy,lights_pars_begin:ky,lights_toon_fragment:Oy,lights_toon_pars_fragment:By,lights_phong_fragment:zy,lights_phong_pars_fragment:Hy,lights_physical_fragment:Vy,lights_physical_pars_fragment:Gy,lights_fragment_begin:Wy,lights_fragment_maps:$y,lights_fragment_end:Xy,lightprobes_pars_fragment:qy,logdepthbuf_fragment:Yy,logdepthbuf_pars_fragment:Zy,logdepthbuf_pars_vertex:Ky,logdepthbuf_vertex:Jy,map_fragment:jy,map_pars_fragment:Qy,map_particle_fragment:tx,map_particle_pars_fragment:ex,metalnessmap_fragment:nx,metalnessmap_pars_fragment:ix,morphinstance_vertex:sx,morphcolor_vertex:rx,morphnormal_vertex:ox,morphtarget_pars_vertex:ax,morphtarget_vertex:lx,normal_fragment_begin:cx,normal_fragment_maps:hx,normal_pars_fragment:dx,normal_pars_vertex:ux,normal_vertex:fx,normalmap_pars_fragment:px,clearcoat_normal_fragment_begin:mx,clearcoat_normal_fragment_maps:gx,clearcoat_pars_fragment:yx,iridescence_pars_fragment:xx,opaque_fragment:vx,packing:_x,premultiplied_alpha_fragment:Mx,project_vertex:wx,dithering_fragment:bx,dithering_pars_fragment:Sx,roughnessmap_fragment:Tx,roughnessmap_pars_fragment:Ex,shadowmap_pars_fragment:Ax,shadowmap_pars_vertex:Cx,shadowmap_vertex:Rx,shadowmask_pars_fragment:Px,skinbase_vertex:Ix,skinning_pars_vertex:Lx,skinning_vertex:Dx,skinnormal_vertex:Nx,specularmap_fragment:Ux,specularmap_pars_fragment:kx,tonemapping_fragment:Fx,tonemapping_pars_fragment:Ox,transmission_fragment:Bx,transmission_pars_fragment:zx,uv_pars_fragment:Hx,uv_pars_vertex:Vx,uv_vertex:Gx,worldpos_vertex:Wx,background_vert:$x,background_frag:Xx,backgroundCube_vert:qx,backgroundCube_frag:Yx,cube_vert:Zx,cube_frag:Kx,depth_vert:Jx,depth_frag:jx,distance_vert:Qx,distance_frag:tv,equirect_vert:ev,equirect_frag:nv,linedashed_vert:iv,linedashed_frag:sv,meshbasic_vert:rv,meshbasic_frag:ov,meshlambert_vert:av,meshlambert_frag:lv,meshmatcap_vert:cv,meshmatcap_frag:hv,meshnormal_vert:dv,meshnormal_frag:uv,meshphong_vert:fv,meshphong_frag:pv,meshphysical_vert:mv,meshphysical_frag:gv,meshtoon_vert:yv,meshtoon_frag:xv,points_vert:vv,points_frag:_v,shadow_vert:Mv,shadow_frag:wv,sprite_vert:bv,sprite_frag:Sv},vt={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},pi={basic:{uniforms:mn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:mn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:mn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:mn([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:mn([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new St(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:mn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:mn([vt.points,vt.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:mn([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:mn([vt.common,vt.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:mn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:mn([vt.sprite,vt.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distance:{uniforms:mn([vt.common,vt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distance_vert,fragmentShader:ne.distance_frag},shadow:{uniforms:mn([vt.lights,vt.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};pi.physical={uniforms:mn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};var Oc={r:0,b:0,g:0},Tv=new ce,am=new jt;am.set(-1,0,0,0,1,0,0,0,1);function Ev(s,t,e,n,i,r){let o=new St(0),a=i===!0?0:1,l,c,h=null,d=0,u=null;function f(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){let v=x.backgroundBlurriness>0;M=t.get(M,v)}return M}function p(x){let M=!1,v=f(x);v===null?m(o,a):v&&v.isColor&&(m(v,1),M=!0);let S=s.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(x,M){let v=f(M);v&&(v.isCubeTexture||v.mapping===Ko)?(c===void 0&&(c=new ge(new nn(1,1,1),new Ie({name:"BackgroundCubeMaterial",uniforms:Ds(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Tv.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(am),c.material.toneMapped=se.getTransfer(v.colorSpace)!==ye,(h!==v||d!==v.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,u=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ge(new Ts(2,2),new Ie({name:"BackgroundMaterial",uniforms:Ds(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:ts,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=se.getTransfer(v.colorSpace)!==ye,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,u=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,M){x.getRGB(Oc,Gd(s)),e.buffers.color.setClear(Oc.r,Oc.g,Oc.b,M,r)}function y(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,M=1){o.set(x),a=M,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,m(o,a)},render:p,addToRenderList:g,dispose:y}}function Av(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,o=!1;function a(I,D,O,N,z){let q=!1,$=d(I,N,O,D);r!==$&&(r=$,c(r.object)),q=f(I,N,O,z),q&&p(I,N,O,z),z!==null&&t.update(z,s.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,v(I,D,O,N),z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return s.createVertexArray()}function c(I){return s.bindVertexArray(I)}function h(I){return s.deleteVertexArray(I)}function d(I,D,O,N){let z=N.wireframe===!0,q=n[D.id];q===void 0&&(q={},n[D.id]=q);let $=I.isInstancedMesh===!0?I.id:0,it=q[$];it===void 0&&(it={},q[$]=it);let W=it[O.id];W===void 0&&(W={},it[O.id]=W);let j=W[z];return j===void 0&&(j=u(l()),W[z]=j),j}function u(I){let D=[],O=[],N=[];for(let z=0;z<e;z++)D[z]=0,O[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:O,attributeDivisors:N,object:I,attributes:{},index:null}}function f(I,D,O,N){let z=r.attributes,q=D.attributes,$=0,it=O.getAttributes();for(let W in it)if(it[W].location>=0){let Q=z[W],Rt=q[W];if(Rt===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(Rt=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(Rt=I.instanceColor)),Q===void 0||Q.attribute!==Rt||Rt&&Q.data!==Rt.data)return!0;$++}return r.attributesNum!==$||r.index!==N}function p(I,D,O,N){let z={},q=D.attributes,$=0,it=O.getAttributes();for(let W in it)if(it[W].location>=0){let Q=q[W];Q===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor));let Rt={};Rt.attribute=Q,Q&&Q.data&&(Rt.data=Q.data),z[W]=Rt,$++}r.attributes=z,r.attributesNum=$,r.index=N}function g(){let I=r.newAttributes;for(let D=0,O=I.length;D<O;D++)I[D]=0}function m(I){y(I,0)}function y(I,D){let O=r.newAttributes,N=r.enabledAttributes,z=r.attributeDivisors;O[I]=1,N[I]===0&&(s.enableVertexAttribArray(I),N[I]=1),z[I]!==D&&(s.vertexAttribDivisor(I,D),z[I]=D)}function x(){let I=r.newAttributes,D=r.enabledAttributes;for(let O=0,N=D.length;O<N;O++)D[O]!==I[O]&&(s.disableVertexAttribArray(O),D[O]=0)}function M(I,D,O,N,z,q,$){$===!0?s.vertexAttribIPointer(I,D,O,z,q):s.vertexAttribPointer(I,D,O,N,z,q)}function v(I,D,O,N){g();let z=N.attributes,q=O.getAttributes(),$=D.defaultAttributeValues;for(let it in q){let W=q[it];if(W.location>=0){let j=z[it];if(j===void 0&&(it==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),it==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){let Q=j.normalized,Rt=j.itemSize,At=t.get(j);if(At===void 0)continue;let he=At.buffer,Qt=At.type,ie=At.bytesPerElement,Y=Qt===s.INT||Qt===s.UNSIGNED_INT||j.gpuType===Ql;if(j.isInterleavedBufferAttribute){let J=j.data,ut=J.stride,Ft=j.offset;if(J.isInstancedInterleavedBuffer){for(let Tt=0;Tt<W.locationSize;Tt++)y(W.location+Tt,J.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Tt=0;Tt<W.locationSize;Tt++)m(W.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,he);for(let Tt=0;Tt<W.locationSize;Tt++)M(W.location+Tt,Rt/W.locationSize,Qt,Q,ut*ie,(Ft+Rt/W.locationSize*Tt)*ie,Y)}else{if(j.isInstancedBufferAttribute){for(let J=0;J<W.locationSize;J++)y(W.location+J,j.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let J=0;J<W.locationSize;J++)m(W.location+J);s.bindBuffer(s.ARRAY_BUFFER,he);for(let J=0;J<W.locationSize;J++)M(W.location+J,Rt/W.locationSize,Qt,Q,Rt*ie,Rt/W.locationSize*J*ie,Y)}}else if($!==void 0){let Q=$[it];if(Q!==void 0)switch(Q.length){case 2:s.vertexAttrib2fv(W.location,Q);break;case 3:s.vertexAttrib3fv(W.location,Q);break;case 4:s.vertexAttrib4fv(W.location,Q);break;default:s.vertexAttrib1fv(W.location,Q)}}}}x()}function S(){A();for(let I in n){let D=n[I];for(let O in D){let N=D[O];for(let z in N){let q=N[z];for(let $ in q)h(q[$].object),delete q[$];delete N[z]}}delete n[I]}}function T(I){if(n[I.id]===void 0)return;let D=n[I.id];for(let O in D){let N=D[O];for(let z in N){let q=N[z];for(let $ in q)h(q[$].object),delete q[$];delete N[z]}}delete n[I.id]}function C(I){for(let D in n){let O=n[D];for(let N in O){let z=O[N];if(z[I.id]===void 0)continue;let q=z[I.id];for(let $ in q)h(q[$].object),delete q[$];delete z[I.id]}}}function _(I){for(let D in n){let O=n[D],N=I.isInstancedMesh===!0?I.id:0,z=O[N];if(z!==void 0){for(let q in z){let $=z[q];for(let it in $)h($[it].object),delete $[it];delete z[q]}delete O[N],Object.keys(O).length===0&&delete n[D]}}}function A(){R(),o=!0,r!==i&&(r=i,c(r.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:A,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:m,disableUnusedAttributes:x}}function Cv(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Rv(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==bn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let _=C===sn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==pn&&C!==zn&&!_&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Xt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Xt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),S=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:y,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:v,maxSamples:S,samples:T}}function Pv(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Kn,a=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let p=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,y=s.get(d);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{let x=r?0:n,M=x*4,v=y.clippingState||null;l.value=v,v=h(p,u,M,f);for(let S=0;S!==M;++S)v[S]=e[S];y.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){let g=d!==null?d.length:0,m=null;if(g!==0){if(m=l.value,p!==!0||m===null){let y=f+g*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<y)&&(m=new Float32Array(y));for(let M=0,v=f;M!==g;++M,v+=4)o.copy(d[M]).applyMatrix4(x,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}var Ir=4,Iv=6,Lv=20,Dv=256,sa=new Qi,Bp=new St,jd=null,Qd=0,tu=0,eu=!1,Nv=new L,Ns=new L,Dr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=Nv}=r;jd=this._renderer.getRenderTarget(),Qd=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(jd,Qd,tu),this._renderer.xr.enabled=eu,t.scissorTest=!1,Pr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===es||t.mapping===Ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),jd=this._renderer.getRenderTarget(),Qd=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:sn,format:bn,colorSpace:lo,depthBuffer:!1},i=zp(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zp(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Uv(r)),this._blurMaterial=Fv(r,t,e),this._ggxMaterial=kv(r,t,e)}return i}_compileMaterial(t){let e=new ge(new be,t);this._renderer.compile(e,sa)}_sceneToCubeUV(t,e,n,i,r){let l=new fn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Bp),d.toneMapping=Qn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ge(new nn,new vo({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1})));let g=this._backgroundBox,m=g.material,y=!1,x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,y=!0):(m.color.copy(Bp),y=!0);for(let M=0;M<6;M++){let v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let S=this._cubeSize;Pr(i,v*S,M>2?S:0,S,S),d.setRenderTarget(i),y&&d.render(g,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=x}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===es||t.mapping===Ls;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vp()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hp());let r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Pr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,sa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:p}=this,g=this._sizeLods[n],m=3*g*(n>p-Ir?n-p+Ir:0),y=4*(this._cubeSize-g);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Pr(r,m,y,3*g,2*g),i.setRenderTarget(r),i.render(a,sa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Pr(t,m,y,3*g,2*g),i.setRenderTarget(t),i.render(a,sa)}_blur(t,e,n,i){let r=this._pingPongRenderTarget,o=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,i,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[i];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],d=3*h*(i>this._lodMax-Ir?i-this._lodMax+Ir:0),u=4*(this._cubeSize-h);Pr(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,sa)}};function Uv(s){let t=[],e=[],n=s,i=s-Ir+1+Iv;for(let r=0;r<i;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,p=new Float32Array(f*u*d),g=new Float32Array(f*u*d);for(let y=0;y<d;y++){let x=y%3*2/3-1,M=y>2?0:-1,v=[x,M,0,x+2/3,M,0,x+2/3,M+1,0,x,M,0,x+2/3,M+1,0,x,M+1,0];p.set(v,f*u*y);for(let S=0;S<u;S++){let T=h[S*2]*2-1,C=h[S*2+1]*2-1;y===0?Ns.set(1,C,T):y===1?Ns.set(-T,1,-C):y===2?Ns.set(-T,C,1):y===3?Ns.set(-1,C,-T):y===4?Ns.set(-T,-1,C):Ns.set(T,C,-1),Ns.toArray(g,(y*u+S)*f)}}let m=new be;m.setAttribute("position",new en(p,f)),m.setAttribute("outputDirection",new en(g,f)),e.push(new ge(m,null)),n>Ir&&n--}return{lodMeshes:e,sizeLods:t}}function zp(s,t,e){let n=new Ge(s,t,e);return n.texture.mapping=Ko,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Pr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function kv(s,t,e){return new Ie({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Dv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:We,depthTest:!1,depthWrite:!1})}function Fv(s,t,e){return new Ie({name:"SphericalGaussianBlur",defines:{SAMPLES:Lv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Vc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:We,depthTest:!1,depthWrite:!1})}function Hp(){return new Ie({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:We,depthTest:!1,depthWrite:!1})}function Vp(){return new Ie({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:We,depthTest:!1,depthWrite:!1})}function Vc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var zc=class extends Ge{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new bo(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new nn(5,5,5),r=new Ie({name:"CubemapFromEquirect",uniforms:Ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Je,blending:We});r.uniforms.tEquirect.value=e;let o=new ge(i,r),a=e.minFilter;return e.minFilter===ns&&(e.minFilter=on),new $l(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}};function Ov(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Kl||f===Jl)if(t.has(u)){let p=t.get(u).texture;return a(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let g=new zc(p.height);return g.fromEquirectangularTexture(s,u),t.set(u,g),u.addEventListener("dispose",c),a(g.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,p=f===Kl||f===Jl,g=f===es||f===Ls;if(p||g){let m=e.get(u),y=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==y)return n===null&&(n=new Dr(s)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{let x=u.image;return p&&x&&x.height>0||g&&x&&l(x)?(n===null&&(n=new Dr(s)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function a(u,f){return f===Kl?u.mapping=es:f===Jl&&(u.mapping=Ls),u}function l(u){let f=0,p=6;for(let g=0;g<p;g++)u[g]!==void 0&&f++;return f===p}function c(u){let f=u.target;f.removeEventListener("dispose",c);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function Bv(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ms("WebGLRenderer: "+n+" extension not supported."),i}}}function zv(s,t,e,n){let i={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",o),delete i[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],s.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,p=d.attributes.position,g=0;if(p===void 0)return;if(f!==null){let x=f.array;g=f.version;for(let M=0,v=x.length;M<v;M+=3){let S=x[M+0],T=x[M+1],C=x[M+2];u.push(S,T,T,C,C,S)}}else{let x=p.array;g=p.version;for(let M=0,v=x.length/3-1;M<v;M+=3){let S=M+0,T=M+1,C=M+2;u.push(S,T,T,C,C,S)}}let m=new(p.count>=65535?yo:go)(u,1);m.version=g;let y=r.get(d);y&&t.remove(y),r.set(d,m)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Hv(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let g=0;for(let m=0;m<f;m++)g+=u[m];e.update(g,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Vv(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:qt("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Gv(s,t,e){let n=new WeakMap,i=new Ue;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let A=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],M=0;f===!0&&(M=1),p===!0&&(M=2),g===!0&&(M=3);let v=a.attributes.position.count*M,S=1;v>t.maxTextureSize&&(S=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let T=new Float32Array(v*S*4*d),C=new uo(T,v,S,d);C.type=zn,C.needsUpdate=!0;let _=M*4;for(let R=0;R<d;R++){let I=m[R],D=y[R],O=x[R],N=v*S*4*R;for(let z=0;z<I.count;z++){let q=z*_;f===!0&&(i.fromBufferAttribute(I,z),T[N+q+0]=i.x,T[N+q+1]=i.y,T[N+q+2]=i.z,T[N+q+3]=0),p===!0&&(i.fromBufferAttribute(D,z),T[N+q+4]=i.x,T[N+q+5]=i.y,T[N+q+6]=i.z,T[N+q+7]=0),g===!0&&(i.fromBufferAttribute(O,z),T[N+q+8]=i.x,T[N+q+9]=i.y,T[N+q+10]=i.z,T[N+q+11]=O.itemSize===4?i.w:1)}}u={count:d,texture:C,size:new ht(v,S)},n.set(a,u),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let g=0;g<c.length;g++)f+=c[g];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Wv(s,t,e,n,i){let r=new WeakMap;function o(c){let h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var $v={[Wo]:"LINEAR_TONE_MAPPING",[$o]:"REINHARD_TONE_MAPPING",[Xo]:"CINEON_TONE_MAPPING",[Is]:"ACES_FILMIC_TONE_MAPPING",[Yo]:"AGX_TONE_MAPPING",[Zo]:"NEUTRAL_TONE_MAPPING",[qo]:"CUSTOM_TONE_MAPPING"};function Xv(s,t,e,n,i,r){let o=new Ge(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new be;c.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Kt([0,2,0,0,2,0],2));let h=new Sr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ge(c,h),u=new Qi(-1,1,1,-1,0,1),f=null,p=null,g=!1,m,y=null,x=[],M=!1;this.setSize=function(v,S){o.setSize(v,S),a!==null&&a.setSize(v,S),l!==null&&l.setSize(v,S);for(let T=0;T<x.length;T++){let C=x[T];C.setSize&&C.setSize(v,S)}},this.setEffects=function(v){x=v,M=x.length>0&&x[0].isRenderPass===!0;let S=o.width,T=o.height;x.length>0&&a===null&&(a=new Ge(S,T,{type:sn,depthBuffer:!1,stencilBuffer:!1}),l=new Ge(S,T,{type:sn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<x.length;C++){let _=x[C];_.setSize&&_.setSize(S,T)}},this.begin=function(v,S){if(g||v.toneMapping===Qn&&x.length===0)return!1;if(y=S,S!==null){let T=S.width,C=S.height;(o.width!==T||o.height!==C)&&this.setSize(T,C)}return M===!1&&v.setRenderTarget(o),m=v.toneMapping,v.toneMapping=Qn,!0},this.hasRenderPass=function(){return M},this.end=function(v,S){v.toneMapping=m,g=!0;let T=o,C=a;for(let _=0;_<x.length;_++){let A=x[_];A.enabled!==!1&&(A.render(v,C,T,S),A.needsSwap!==!1&&(T=C,C=C===a?l:a))}if(f!==v.outputColorSpace||p!==v.toneMapping){f=v.outputColorSpace,p=v.toneMapping,h.defines={},se.getTransfer(f)===ye&&(h.defines.SRGB_TRANSFER="");let _=$v[p];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(y),v.render(d,u),y=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var lm=new vn,su=new di(1,1),cm=new uo,hm=new bl,dm=new bo,Gp=[],Wp=[],$p=new Float32Array(16),Xp=new Float32Array(9),qp=new Float32Array(4);function Nr(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Gp[i];if(r===void 0&&(r=new Float32Array(i),Gp[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function je(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Qe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Gc(s,t){let e=Wp[t];e===void 0&&(e=new Int32Array(t),Wp[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function qv(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Yv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;s.uniform2fv(this.addr,t),Qe(e,t)}}function Zv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;s.uniform3fv(this.addr,t),Qe(e,t)}}function Kv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;s.uniform4fv(this.addr,t),Qe(e,t)}}function Jv(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;qp.set(n),s.uniformMatrix2fv(this.addr,!1,qp),Qe(e,n)}}function jv(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Xp.set(n),s.uniformMatrix3fv(this.addr,!1,Xp),Qe(e,n)}}function Qv(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;$p.set(n),s.uniformMatrix4fv(this.addr,!1,$p),Qe(e,n)}}function t_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function e_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;s.uniform2iv(this.addr,t),Qe(e,t)}}function n_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;s.uniform3iv(this.addr,t),Qe(e,t)}}function i_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;s.uniform4iv(this.addr,t),Qe(e,t)}}function s_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function r_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;s.uniform2uiv(this.addr,t),Qe(e,t)}}function o_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;s.uniform3uiv(this.addr,t),Qe(e,t)}}function a_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;s.uniform4uiv(this.addr,t),Qe(e,t)}}function l_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(su.compareFunction=e.isReversedDepthBuffer()?Fc:kc,r=su):r=lm,e.setTexture2D(t||r,i)}function c_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||hm,i)}function h_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||dm,i)}function d_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||cm,i)}function u_(s){switch(s){case 5126:return qv;case 35664:return Yv;case 35665:return Zv;case 35666:return Kv;case 35674:return Jv;case 35675:return jv;case 35676:return Qv;case 5124:case 35670:return t_;case 35667:case 35671:return e_;case 35668:case 35672:return n_;case 35669:case 35673:return i_;case 5125:return s_;case 36294:return r_;case 36295:return o_;case 36296:return a_;case 35678:case 36198:case 36298:case 36306:case 35682:return l_;case 35679:case 36299:case 36307:return c_;case 35680:case 36300:case 36308:case 36293:return h_;case 36289:case 36303:case 36311:case 36292:return d_}}function f_(s,t){s.uniform1fv(this.addr,t)}function p_(s,t){let e=Nr(t,this.size,2);s.uniform2fv(this.addr,e)}function m_(s,t){let e=Nr(t,this.size,3);s.uniform3fv(this.addr,e)}function g_(s,t){let e=Nr(t,this.size,4);s.uniform4fv(this.addr,e)}function y_(s,t){let e=Nr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function x_(s,t){let e=Nr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function v_(s,t){let e=Nr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function __(s,t){s.uniform1iv(this.addr,t)}function M_(s,t){s.uniform2iv(this.addr,t)}function w_(s,t){s.uniform3iv(this.addr,t)}function b_(s,t){s.uniform4iv(this.addr,t)}function S_(s,t){s.uniform1uiv(this.addr,t)}function T_(s,t){s.uniform2uiv(this.addr,t)}function E_(s,t){s.uniform3uiv(this.addr,t)}function A_(s,t){s.uniform4uiv(this.addr,t)}function C_(s,t,e){let n=this.cache,i=t.length,r=Gc(e,i);je(n,r)||(s.uniform1iv(this.addr,r),Qe(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=su:o=lm;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function R_(s,t,e){let n=this.cache,i=t.length,r=Gc(e,i);je(n,r)||(s.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||hm,r[o])}function P_(s,t,e){let n=this.cache,i=t.length,r=Gc(e,i);je(n,r)||(s.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||dm,r[o])}function I_(s,t,e){let n=this.cache,i=t.length,r=Gc(e,i);je(n,r)||(s.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||cm,r[o])}function L_(s){switch(s){case 5126:return f_;case 35664:return p_;case 35665:return m_;case 35666:return g_;case 35674:return y_;case 35675:return x_;case 35676:return v_;case 5124:case 35670:return __;case 35667:case 35671:return M_;case 35668:case 35672:return w_;case 35669:case 35673:return b_;case 5125:return S_;case 36294:return T_;case 36295:return E_;case 36296:return A_;case 35678:case 36198:case 36298:case 36306:case 35682:return C_;case 35679:case 36299:case 36307:return R_;case 35680:case 36300:case 36308:case 36293:return P_;case 36289:case 36303:case 36311:case 36292:return I_}}var ru=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=u_(e.type)}},ou=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=L_(e.type)}},au=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},nu=/(\w+)(\])?(\[|\.)?/g;function Yp(s,t){s.seq.push(t),s.map[t.id]=t}function D_(s,t,e){let n=s.name,i=n.length;for(nu.lastIndex=0;;){let r=nu.exec(n),o=nu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Yp(e,c===void 0?new ru(a,s,t):new ou(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new au(a),Yp(e,d)),e=d}}}var Lr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);D_(a,l,this)}let i=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function Zp(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var N_=37297,U_=0;function k_(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Kp=new jt;function F_(s){se._getMatrix(Kp,se.workingColorSpace,s);let t=`mat3( ${Kp.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(s)){case co:return[t,"LinearTransferOETF"];case ye:return[t,"sRGBTransferOETF"];default:return Xt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Jp(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+k_(s.getShaderSource(t),a)}else return r}function O_(s,t){let e=F_(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var B_={[Wo]:"Linear",[$o]:"Reinhard",[Xo]:"Cineon",[Is]:"ACESFilmic",[Yo]:"AgX",[Zo]:"Neutral",[qo]:"Custom"};function z_(s,t){let e=B_[t];return e===void 0?(Xt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Bc=new L;function H_(){se.getLuminanceCoefficients(Bc);let s=Bc.x.toFixed(4),t=Bc.y.toFixed(4),e=Bc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(oa).join(`
`)}function G_(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function W_(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function oa(s){return s!==""}function jp(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qp(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var $_=/^[ \t]*#include +<([\w\d./]+)>/gm;function lu(s){return s.replace($_,q_)}var X_=new Map;function q_(s,t){let e=ne[t];if(e===void 0){let n=X_.get(t);if(n!==void 0)e=ne[n],Xt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return lu(e)}var Y_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tm(s){return s.replace(Y_,Z_)}function Z_(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function em(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var K_={[Rs]:"SHADOWMAP_TYPE_PCF",[Tr]:"SHADOWMAP_TYPE_VSM"};function J_(s){return K_[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var j_={[es]:"ENVMAP_TYPE_CUBE",[Ls]:"ENVMAP_TYPE_CUBE",[Ko]:"ENVMAP_TYPE_CUBE_UV"};function Q_(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":j_[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var t1={[Ls]:"ENVMAP_MODE_REFRACTION"};function e1(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":t1[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var n1={[Zl]:"ENVMAP_BLENDING_MULTIPLY",[mp]:"ENVMAP_BLENDING_MIX",[gp]:"ENVMAP_BLENDING_ADD"};function i1(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":n1[s.combine]||"ENVMAP_BLENDING_NONE"}function s1(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function r1(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=J_(e),c=Q_(e),h=e1(e),d=i1(e),u=s1(e),f=V_(e),p=G_(r),g=i.createProgram(),m,y,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oa).join(`
`),m.length>0&&(m+=`
`),y=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oa).join(`
`),y.length>0&&(y+=`
`)):(m=[em(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(oa).join(`
`),y=[em(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?ne.tonemapping_pars_fragment:"",e.toneMapping!==Qn?z_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,O_("linearToOutputTexel",e.outputColorSpace),H_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(oa).join(`
`)),o=lu(o),o=jp(o,e),o=Qp(o,e),a=lu(a),a=jp(a,e),a=Qp(a,e),o=tm(o),a=tm(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,y=["#define varying in",e.glslVersion===zd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===zd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);let M=x+m+o,v=x+y+a,S=Zp(i,i.VERTEX_SHADER,M),T=Zp(i,i.FRAGMENT_SHADER,v);i.attachShader(g,S),i.attachShader(g,T),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function C(I){if(s.debug.checkShaderErrors){let D=i.getProgramInfoLog(g)||"",O=i.getShaderInfoLog(S)||"",N=i.getShaderInfoLog(T)||"",z=D.trim(),q=O.trim(),$=N.trim(),it=!0,W=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(it=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,S,T);else{let j=Jp(i,S,"vertex"),Q=Jp(i,T,"fragment");qt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+j+`
`+Q)}else z!==""?Xt("WebGLProgram: Program Info Log:",z):(q===""||$==="")&&(W=!1);W&&(I.diagnostics={runnable:it,programLog:z,vertexShader:{log:q,prefix:m},fragmentShader:{log:$,prefix:y}})}i.deleteShader(S),i.deleteShader(T),_=new Lr(i,g),A=W_(i,g)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(g,N_)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=U_++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=T,this}var o1=0,cu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new hu(t),e.set(t,n)),n}},hu=class{constructor(t){this.id=o1++,this.code=t,this.usedTimes=0}};function a1(s){return s===ss||s===na||s===ia}function l1(s,t,e,n,i,r){let o=new fo,a=new cu,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,A,R,I,D,O){let N=I.fog,z=D.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,it=t.get(_.envMap||q,$),W=it&&it.mapping===Ko?it.image.height:null,j=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Xt("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let Q=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Rt=Q!==void 0?Q.length:0,At=0;z.morphAttributes.position!==void 0&&(At=1),z.morphAttributes.normal!==void 0&&(At=2),z.morphAttributes.color!==void 0&&(At=3);let he,Qt,ie,Y;if(j){let Ae=pi[j];he=Ae.vertexShader,Qt=Ae.fragmentShader}else{he=_.vertexShader,Qt=_.fragmentShader;let Ae=a.getVertexShaderStage(_),xe=a.getFragmentShaderStage(_);a.update(_,Ae,xe),ie=Ae.id,Y=xe.id}let J=s.getRenderTarget(),ut=s.state.buffers.depth.getReversed(),Ft=D.isInstancedMesh===!0,Tt=D.isBatchedMesh===!0,Wt=!!_.map,pe=!!_.matcap,et=!!it,rt=!!_.aoMap,ot=!!_.lightMap,at=!!_.bumpMap&&_.wireframe===!1,dt=!!_.normalMap,Vt=!!_.displacementMap,Ot=!!_.emissiveMap,$t=!!_.metalnessMap,Yt=!!_.roughnessMap,U=_.anisotropy>0,ue=_.clearcoat>0,te=_.dispersion>0,P=_.retroreflectivity>0,w=_.iridescence>0,B=_.sheen>0,H=_.transmission>0,Z=U&&!!_.anisotropyMap,ct=ue&&!!_.clearcoatMap,ft=ue&&!!_.clearcoatNormalMap,K=ue&&!!_.clearcoatRoughnessMap,nt=w&&!!_.iridescenceMap,gt=w&&!!_.iridescenceThicknessMap,Ut=B&&!!_.sheenColorMap,mt=B&&!!_.sheenRoughnessMap,pt=!!_.specularMap,It=!!_.specularColorMap,Bt=!!_.specularIntensityMap,Zt=H&&!!_.transmissionMap,F=H&&!!_.thicknessMap,yt=!!_.gradientMap,tt=!!_.alphaMap,xt=_.alphaTest>0,Et=!!_.alphaHash,st=!!_.extensions,zt=Qn;_.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(zt=s.toneMapping);let Nt={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:he,fragmentShader:Qt,defines:_.defines,customVertexShaderID:ie,customFragmentShaderID:Y,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&D._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&D.instanceColor!==null,instancingMorph:Ft&&D.morphTexture!==null,outputColorSpace:J===null?s.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:se.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Wt,matcap:pe,envMap:et,envMapMode:et&&it.mapping,envMapCubeUVHeight:W,aoMap:rt,lightMap:ot,bumpMap:at,normalMap:dt,displacementMap:Vt,emissiveMap:Ot,normalMapObjectSpace:dt&&_.normalMapType===vp,normalMapTangentSpace:dt&&_.normalMapType===Cr,packedNormalMap:dt&&_.normalMapType===Cr&&a1(_.normalMap.format),metalnessMap:$t,roughnessMap:Yt,anisotropy:U,anisotropyMap:Z,clearcoat:ue,clearcoatMap:ct,clearcoatNormalMap:ft,clearcoatRoughnessMap:K,dispersion:te,retroreflection:P,iridescence:w,iridescenceMap:nt,iridescenceThicknessMap:gt,sheen:B,sheenColorMap:Ut,sheenRoughnessMap:mt,specularMap:pt,specularColorMap:It,specularIntensityMap:Bt,transmission:H,transmissionMap:Zt,thicknessMap:F,gradientMap:yt,opaque:_.transparent===!1&&_.blending===Er&&_.alphaToCoverage===!1,alphaMap:tt,alphaTest:xt,alphaHash:Et,combine:_.combine,mapUv:Wt&&p(_.map.channel),aoMapUv:rt&&p(_.aoMap.channel),lightMapUv:ot&&p(_.lightMap.channel),bumpMapUv:at&&p(_.bumpMap.channel),normalMapUv:dt&&p(_.normalMap.channel),displacementMapUv:Vt&&p(_.displacementMap.channel),emissiveMapUv:Ot&&p(_.emissiveMap.channel),metalnessMapUv:$t&&p(_.metalnessMap.channel),roughnessMapUv:Yt&&p(_.roughnessMap.channel),anisotropyMapUv:Z&&p(_.anisotropyMap.channel),clearcoatMapUv:ct&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:ft&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:gt&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:mt&&p(_.sheenRoughnessMap.channel),specularMapUv:pt&&p(_.specularMap.channel),specularColorMapUv:It&&p(_.specularColorMap.channel),specularIntensityMapUv:Bt&&p(_.specularIntensityMap.channel),transmissionMapUv:Zt&&p(_.transmissionMap.channel),thicknessMapUv:F&&p(_.thicknessMap.channel),alphaMapUv:tt&&p(_.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(dt||U),vertexNormals:!!z.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!z.attributes.uv&&(Wt||tt),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||z.attributes.normal===void 0&&dt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ut,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:At,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:O.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:zt,decodeVideoTexture:Wt&&_.map.isVideoTexture===!0&&se.getTransfer(_.map.colorSpace)===ye,decodeVideoTextureEmissive:Ot&&_.emissiveMap.isVideoTexture===!0&&se.getTransfer(_.emissiveMap.colorSpace)===ye,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===On,flipSided:_.side===Je,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:st&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&_.extensions.multiDraw===!0||Tt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Nt.vertexUv1s=l.has(1),Nt.vertexUv2s=l.has(2),Nt.vertexUv3s=l.has(3),l.clear(),Nt}function m(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)A.push(R),A.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(y(A,_),x(A,_),A.push(s.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function y(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function x(_,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function M(_){let A=f[_.type],R;if(A){let I=pi[A];R=Sn.clone(I.uniforms)}else R=_.uniforms;return R}function v(_,A){let R=h.get(A);return R!==void 0?++R.usedTimes:(R=new r1(s,A,_,i),c.push(R),h.set(A,R)),R}function S(_){if(--_.usedTimes===0){let A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function T(_){a.remove(_)}function C(){a.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:M,acquireProgram:v,releaseProgram:S,releaseShaderCache:T,programs:c,dispose:C}}function c1(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function h1(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function nm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function im(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,p,g,m,y){let x=s[t];return x===void 0?(x={id:u.id,object:u,geometry:f,material:p,materialVariant:o(u),groupOrder:g,renderOrder:u.renderOrder,z:m,group:y},s[t]=x):(x.id=u.id,x.object=u,x.geometry=f,x.material=p,x.materialVariant=o(u),x.groupOrder=g,x.renderOrder=u.renderOrder,x.z=m,x.group=y),t++,x}function l(u,f,p,g,m,y,x){x.reversedDepth===!0&&(m=-m);let M=a(u,f,p,g,m,y);p.transmission>0?n.push(M):p.transparent===!0?i.push(M):e.push(M)}function c(u,f,p,g,m,y){let x=a(u,f,p,g,m,y);p.transmission>0?n.unshift(x):p.transparent===!0?i.unshift(x):e.unshift(x)}function h(u,f){e.length>1&&e.sort(u||h1),n.length>1&&n.sort(f||nm),i.length>1&&i.sort(f||nm)}function d(){for(let u=t,f=s.length;u<f;u++){let p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function d1(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new im,s.set(n,[o])):i>=r.length?(o=new im,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function u1(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new St};break;case"SpotLight":e={position:new L,direction:new L,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new St,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new St,groundColor:new St};break;case"RectAreaLight":e={color:new St,position:new L,halfWidth:new L,halfHeight:new L};break}return s[t.id]=e,e}}}function f1(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var p1=0;function m1(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function g1(s){let t=new u1,e=f1(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let i=new L,r=new ce,o=new ce;function a(c){let h=0,d=0,u=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let f=0,p=0,g=0,m=0,y=0,x=0,M=0,v=0,S=0,T=0,C=0,_=0,A=0,R=0;c.sort(m1);for(let D=0,O=c.length;D<O;D++){let N=c[D],z=N.color,q=N.intensity,$=N.distance,it=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===ss?it=N.shadow.map.texture:it=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=z.r*q,d+=z.g*q,u+=z.b*q;else if(N.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(N.sh.coefficients[W],q);R++}else if(N.isSunLight){let W=t.get(N);if(W.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let j=N.shadow,Q=e.get(N);Q.shadowIntensity=j.intensity,Q.shadowBias=j.bias,Q.shadowNormalBias=j.normalBias,Q.shadowRadius=j.radius,Q.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[p]=Q,n.sunShadowMap[p]=it;let Rt=j.getViewportCount();for(let At=0;At<Rt;At++)n.sunShadowMatrix[g+At]=j.getMatrix(At),n.sunShadowCascade[g+At]=j._cascadeData[At];g+=Rt,p++}n.sun[f]=W,f++}else if(N.isDirectionalLight){let W=t.get(N);if(W.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let j=N.shadow,Q=e.get(N);Q.shadowIntensity=j.intensity,Q.shadowBias=j.bias,Q.shadowNormalBias=j.normalBias,Q.shadowRadius=j.radius,Q.shadowMapSize=j.mapSize,n.directionalShadow[m]=Q,n.directionalShadowMap[m]=it,n.directionalShadowMatrix[m]=N.shadow.matrix,S++}n.directional[m]=W,m++}else if(N.isSpotLight){let W=t.get(N);W.position.setFromMatrixPosition(N.matrixWorld),W.color.copy(z).multiplyScalar(q),W.distance=$,W.coneCos=Math.cos(N.angle),W.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),W.decay=N.decay,n.spot[x]=W;let j=N.shadow;if(N.map&&(n.spotLightMap[_]=N.map,_++,j.updateMatrices(N),N.castShadow&&A++),n.spotLightMatrix[x]=j.matrix,N.castShadow){let Q=e.get(N);Q.shadowIntensity=j.intensity,Q.shadowBias=j.bias,Q.shadowNormalBias=j.normalBias,Q.shadowRadius=j.radius,Q.shadowMapSize=j.mapSize,n.spotShadow[x]=Q,n.spotShadowMap[x]=it,C++}x++}else if(N.isRectAreaLight){let W=t.get(N);W.color.copy(z).multiplyScalar(q),W.halfWidth.set(N.width*.5,0,0),W.halfHeight.set(0,N.height*.5,0),n.rectArea[M]=W,M++}else if(N.isPointLight){let W=t.get(N);if(W.color.copy(N.color).multiplyScalar(N.intensity),W.distance=N.distance,W.decay=N.decay,N.castShadow){let j=N.shadow,Q=e.get(N);Q.shadowIntensity=j.intensity,Q.shadowBias=j.bias,Q.shadowNormalBias=j.normalBias,Q.shadowRadius=j.radius,Q.shadowMapSize=j.mapSize,Q.shadowCameraNear=j.camera.near,Q.shadowCameraFar=j.camera.far,n.pointShadow[y]=Q,n.pointShadowMap[y]=it,n.pointShadowMatrix[y]=N.shadow.matrix,T++}n.point[y]=W,y++}else if(N.isHemisphereLight){let W=t.get(N);W.skyColor.copy(N.color).multiplyScalar(q),W.groundColor.copy(N.groundColor).multiplyScalar(q),n.hemi[v]=W,v++}}M>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let I=n.hash;(I.sunLength!==f||I.directionalLength!==m||I.pointLength!==y||I.spotLength!==x||I.rectAreaLength!==M||I.hemiLength!==v||I.numSunShadows!==p||I.numDirectionalShadows!==S||I.numPointShadows!==T||I.numSpotShadows!==C||I.numSpotMaps!==_||I.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=m,n.spot.length=x,n.rectArea.length=M,n.point.length=y,n.hemi.length=v,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=g,n.sunShadowCascade.length=g,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-A,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,I.sunLength=f,I.directionalLength=m,I.pointLength=y,I.spotLength=x,I.rectAreaLength=M,I.hemiLength=v,I.numSunShadows=p,I.numDirectionalShadows=S,I.numPointShadows=T,I.numSpotShadows=C,I.numSpotMaps=_,I.numLightProbes=R,n.version=p1++)}function l(c,h){let d=0,u=0,f=0,p=0,g=0,m=0,y=h.matrixWorldInverse;for(let x=0,M=c.length;x<M;x++){let v=c[x];if(v.isSunLight){let S=n.sun[d];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(y),d++}else if(v.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(y),u++}else if(v.isSpotLight){let S=n.spot[p];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(y),S.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(y),p++}else if(v.isRectAreaLight){let S=n.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(y),o.identity(),r.copy(v.matrixWorld),r.premultiply(y),o.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(y),f++}else if(v.isHemisphereLight){let S=n.hemi[m];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(y),m++}}}return{setup:a,setupView:l,state:n}}function sm(s){let t=new g1(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){i.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function y1(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new sm(s),t.set(i,[a])):r>=o.length?(a=new sm(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var x1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,v1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_1=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],M1=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],rm=new ce,ra=new L,iu=new L;function w1(s,t,e){let n=new yr,i=new ht,r=new ht,o=new Ue,a=new Ll,l=new Dl,c={},h=e.maxTextureSize,d={[ts]:Je,[Je]:ts,[On]:On},u=new Ie({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:x1,fragmentShader:v1}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let p=new be;p.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new ge(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rs;let y=this.type;this.render=function(T,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===tp&&(Xt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Rs);let A=s.getRenderTarget(),R=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),D=s.state;D.setBlending(We),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let O=y!==this.type;O&&C.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(z=>z.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,z=T.length;N<z;N++){let q=T[N],$=q.shadow;if($===void 0){Xt("WebGLShadowMap:",q,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;i.copy($.mapSize);let it=$.getFrameExtents();i.multiply(it),r.copy($.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/it.x),i.x=r.x*it.x,$.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/it.y),i.y=r.y*it.y,$.mapSize.y=r.y));let W=s.state.buffers.depth.getReversed();if($.camera._reversedDepth=W,$.map===null||O===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Tr){if(q.isPointLight){Xt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Ge(i.x,i.y,{format:ss,type:sn,minFilter:on,magFilter:on,generateMipmaps:!1}),$.map.texture.name=q.name+".shadowMap",$.map.depthTexture=new di(i.x,i.y,zn),$.map.depthTexture.name=q.name+".shadowMapDepth",$.map.depthTexture.format=li,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Ve,$.map.depthTexture.magFilter=Ve}else q.isPointLight?($.map=new zc(i.x),$.map.depthTexture=new Sl(i.x,ti)):($.map=new Ge(i.x,i.y),$.map.depthTexture=new di(i.x,i.y,ti)),$.map.depthTexture.name=q.name+".shadowMap",$.map.depthTexture.format=li,this.type===Rs?($.map.depthTexture.compareFunction=W?Fc:kc,$.map.depthTexture.minFilter=on,$.map.depthTexture.magFilter=on):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Ve,$.map.depthTexture.magFilter=Ve);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==i.x||$.map.height!==i.y)&&$.map.setSize(i.x,i.y);let j=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();q.isPointLight!==!0&&$.updateMatrices(q,_);for(let Q=0;Q<j;Q++){let Rt=$.getCamera(Q);if(q.isPointLight){let At=$.camera,he=$.matrix,Qt=q.distance||At.far;Qt!==At.far&&(At.far=Qt,At.updateProjectionMatrix()),ra.setFromMatrixPosition(q.matrixWorld),At.position.copy(ra),iu.copy(At.position),iu.add(_1[Q]),At.up.copy(M1[Q]),At.lookAt(iu),At.updateMatrixWorld(),he.makeTranslation(-ra.x,-ra.y,-ra.z),rm.multiplyMatrices(At.projectionMatrix,At.matrixWorldInverse),$._frustum.setFromProjectionMatrix(rm,At.coordinateSystem,At.reversedDepth)}if($.map.isWebGLCubeRenderTarget)s.setRenderTarget($.map,Q),s.clear();else{Q===0&&(s.setRenderTarget($.map),s.clear());let At=$.getViewport(Q);o.set(r.x*At.x,r.y*At.y,r.x*At.z,r.y*At.w),D.viewport(o)}n=$.getFrustum(Q),v(C,_,Rt,q,this.type)}$.isPointLightShadow!==!0&&this.type===Tr&&x($,_),$.needsUpdate=!1}y=this.type,m.needsUpdate=!1,s.setRenderTarget(A,R,I)};function x(T,C){let _=t.update(g);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Ge(i.x,i.y,{format:ss,type:sn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(C,null,_,u,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(C,null,_,f,g,null)}function M(T,C,_,A){let R=null,I=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)R=I;else if(R=_.isPointLight===!0?l:a,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let D=R.uuid,O=C.uuid,N=c[D];N===void 0&&(N={},c[D]=N);let z=N[O];z===void 0&&(z=R.clone(),N[O]=z,C.addEventListener("dispose",S)),R=z}if(R.visible=C.visible,R.wireframe=C.wireframe,A===Tr?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:d[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let D=s.properties.get(R);D.light=_}return R}function v(T,C,_,A,R){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===Tr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let O=t.update(T),N=T.material;if(Array.isArray(N)){let z=O.groups;for(let q=0,$=z.length;q<$;q++){let it=z[q],W=N[it.materialIndex];if(W&&W.visible){let j=M(T,W,A,R);T.onBeforeShadow(s,T,C,_,O,j,it),s.renderBufferDirect(_,null,O,j,T,it),T.onAfterShadow(s,T,C,_,O,j,it)}}}else if(N.visible){let z=M(T,N,A,R);T.onBeforeShadow(s,T,C,_,O,z,null),s.renderBufferDirect(_,null,O,z,T,null),T.onAfterShadow(s,T,C,_,O,z,null)}}let D=T.children;for(let O=0,N=D.length;O<N;O++)v(D[O],C,_,A,R)}function S(T){T.target.removeEventListener("dispose",S);for(let _ in c){let A=c[_],R=T.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function b1(s,t){function e(){let F=!1,yt=new Ue,tt=null,xt=new Ue(0,0,0,0);return{setMask:function(Et){tt!==Et&&!F&&(s.colorMask(Et,Et,Et,Et),tt=Et)},setLocked:function(Et){F=Et},setClear:function(Et,st,zt,Nt,Ae){Ae===!0&&(Et*=Nt,st*=Nt,zt*=Nt),yt.set(Et,st,zt,Nt),xt.equals(yt)===!1&&(s.clearColor(Et,st,zt,Nt),xt.copy(yt))},reset:function(){F=!1,tt=null,xt.set(-1,0,0,0)}}}function n(){let F=!1,yt=!1,tt=null,xt=null,Et=null;return{setReversed:function(st){if(yt!==st){let zt=t.get("EXT_clip_control");st?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),yt=st;let Nt=Et;Et=null,this.setClear(Nt)}},getReversed:function(){return yt},setTest:function(st){st?J(s.DEPTH_TEST):ut(s.DEPTH_TEST)},setMask:function(st){tt!==st&&!F&&(s.depthMask(st),tt=st)},setFunc:function(st){if(yt&&(st=Ip[st]),xt!==st){switch(st){case dl:s.depthFunc(s.NEVER);break;case ul:s.depthFunc(s.ALWAYS);break;case fl:s.depthFunc(s.LESS);break;case ur:s.depthFunc(s.LEQUAL);break;case pl:s.depthFunc(s.EQUAL);break;case ml:s.depthFunc(s.GEQUAL);break;case gl:s.depthFunc(s.GREATER);break;case yl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xt=st}},setLocked:function(st){F=st},setClear:function(st){Et!==st&&(Et=st,yt&&(st=1-st),s.clearDepth(st))},reset:function(){F=!1,tt=null,xt=null,Et=null,yt=!1}}}function i(){let F=!1,yt=null,tt=null,xt=null,Et=null,st=null,zt=null,Nt=null,Ae=null;return{setTest:function(xe){F||(xe?J(s.STENCIL_TEST):ut(s.STENCIL_TEST))},setMask:function(xe){yt!==xe&&!F&&(s.stencilMask(xe),yt=xe)},setFunc:function(xe,Vn,ii){(tt!==xe||xt!==Vn||Et!==ii)&&(s.stencilFunc(xe,Vn,ii),tt=xe,xt=Vn,Et=ii)},setOp:function(xe,Vn,ii){(st!==xe||zt!==Vn||Nt!==ii)&&(s.stencilOp(xe,Vn,ii),st=xe,zt=Vn,Nt=ii)},setLocked:function(xe){F=xe},setClear:function(xe){Ae!==xe&&(s.clearStencil(xe),Ae=xe)},reset:function(){F=!1,yt=null,tt=null,xt=null,Et=null,st=null,zt=null,Nt=null,Ae=null}}}let r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,p=[],g=null,m=!1,y=null,x=null,M=null,v=null,S=null,T=null,C=null,_=new St(0,0,0),A=0,R=!1,I=null,D=null,O=null,N=null,z=null,q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,it=0,W=s.getParameter(s.VERSION);W.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(W)[1]),$=it>=1):W.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),$=it>=2);let j=null,Q={},Rt=s.getParameter(s.SCISSOR_BOX),At=s.getParameter(s.VIEWPORT),he=new Ue().fromArray(Rt),Qt=new Ue().fromArray(At);function ie(F,yt,tt,xt){let Et=new Uint8Array(4),st=s.createTexture();s.bindTexture(F,st),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let zt=0;zt<tt;zt++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(yt,0,s.RGBA,1,1,xt,0,s.RGBA,s.UNSIGNED_BYTE,Et):s.texImage2D(yt+zt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Et);return st}let Y={};Y[s.TEXTURE_2D]=ie(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=ie(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=ie(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=ie(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(s.DEPTH_TEST),o.setFunc(ur),at(!1),dt(Ad),J(s.CULL_FACE),rt(We);function J(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function ut(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function Ft(F,yt){return u[F]!==yt?(s.bindFramebuffer(F,yt),u[F]=yt,F===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=yt),F===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=yt),!0):!1}function Tt(F,yt){let tt=p,xt=!1;if(F){tt=f.get(yt),tt===void 0&&(tt=[],f.set(yt,tt));let Et=F.textures;if(tt.length!==Et.length||tt[0]!==s.COLOR_ATTACHMENT0){for(let st=0,zt=Et.length;st<zt;st++)tt[st]=s.COLOR_ATTACHMENT0+st;tt.length=Et.length,xt=!0}}else tt[0]!==s.BACK&&(tt[0]=s.BACK,xt=!0);xt&&s.drawBuffers(tt)}function Wt(F){return g!==F?(s.useProgram(F),g=F,!0):!1}let pe={[Bn]:s.FUNC_ADD,[ep]:s.FUNC_SUBTRACT,[np]:s.FUNC_REVERSE_SUBTRACT};pe[ip]=s.MIN,pe[sp]=s.MAX;let et={[Ps]:s.ZERO,[rp]:s.ONE,[op]:s.SRC_COLOR,[Id]:s.SRC_ALPHA,[hp]:s.SRC_ALPHA_SATURATE,[Go]:s.DST_COLOR,[Vo]:s.DST_ALPHA,[ap]:s.ONE_MINUS_SRC_COLOR,[Ld]:s.ONE_MINUS_SRC_ALPHA,[cp]:s.ONE_MINUS_DST_COLOR,[lp]:s.ONE_MINUS_DST_ALPHA,[dp]:s.CONSTANT_COLOR,[up]:s.ONE_MINUS_CONSTANT_COLOR,[fp]:s.CONSTANT_ALPHA,[pp]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(F,yt,tt,xt,Et,st,zt,Nt,Ae,xe){if(F===We){m===!0&&(ut(s.BLEND),m=!1);return}if(m===!1&&(J(s.BLEND),m=!0),F!==Yl){if(F!==y||xe!==R){if((x!==Bn||S!==Bn)&&(s.blendEquation(s.FUNC_ADD),x=Bn,S=Bn),xe)switch(F){case Er:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Cd:s.blendFunc(s.ONE,s.ONE);break;case Rd:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Pd:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:qt("WebGLState: Invalid blending: ",F);break}else switch(F){case Er:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Cd:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Rd:qt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pd:qt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qt("WebGLState: Invalid blending: ",F);break}M=null,v=null,T=null,C=null,_.set(0,0,0),A=0,y=F,R=xe}return}Et=Et||yt,st=st||tt,zt=zt||xt,(yt!==x||Et!==S)&&(s.blendEquationSeparate(pe[yt],pe[Et]),x=yt,S=Et),(tt!==M||xt!==v||st!==T||zt!==C)&&(s.blendFuncSeparate(et[tt],et[xt],et[st],et[zt]),M=tt,v=xt,T=st,C=zt),(Nt.equals(_)===!1||Ae!==A)&&(s.blendColor(Nt.r,Nt.g,Nt.b,Ae),_.copy(Nt),A=Ae),y=F,R=!1}function ot(F,yt){F.side===On?ut(s.CULL_FACE):J(s.CULL_FACE);let tt=F.side===Je;yt&&(tt=!tt),at(tt),F.blending===Er&&F.transparent===!1?rt(We):rt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let xt=F.stencilWrite;a.setTest(xt),xt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ot(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?J(s.SAMPLE_ALPHA_TO_COVERAGE):ut(s.SAMPLE_ALPHA_TO_COVERAGE)}function at(F){I!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),I=F)}function dt(F){F!==jf?(J(s.CULL_FACE),F!==D&&(F===Ad?s.cullFace(s.BACK):F===Qf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ut(s.CULL_FACE),D=F}function Vt(F){F!==O&&($&&s.lineWidth(F),O=F)}function Ot(F,yt,tt){F?(J(s.POLYGON_OFFSET_FILL),(N!==yt||z!==tt)&&(N=yt,z=tt,o.getReversed()&&(yt=-yt),s.polygonOffset(yt,tt))):ut(s.POLYGON_OFFSET_FILL)}function $t(F){F?J(s.SCISSOR_TEST):ut(s.SCISSOR_TEST)}function Yt(F){F===void 0&&(F=s.TEXTURE0+q-1),j!==F&&(s.activeTexture(F),j=F)}function U(F,yt,tt){tt===void 0&&(j===null?tt=s.TEXTURE0+q-1:tt=j);let xt=Q[tt];xt===void 0&&(xt={type:void 0,texture:void 0},Q[tt]=xt),(xt.type!==F||xt.texture!==yt)&&(j!==tt&&(s.activeTexture(tt),j=tt),s.bindTexture(F,yt||Y[F]),xt.type=F,xt.texture=yt)}function ue(){let F=Q[j];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function te(){try{s.compressedTexImage2D(...arguments)}catch(F){qt("WebGLState:",F)}}function P(){try{s.compressedTexImage3D(...arguments)}catch(F){qt("WebGLState:",F)}}function w(){try{s.texSubImage2D(...arguments)}catch(F){qt("WebGLState:",F)}}function B(){try{s.texSubImage3D(...arguments)}catch(F){qt("WebGLState:",F)}}function H(){try{s.compressedTexSubImage2D(...arguments)}catch(F){qt("WebGLState:",F)}}function Z(){try{s.compressedTexSubImage3D(...arguments)}catch(F){qt("WebGLState:",F)}}function ct(){try{s.texStorage2D(...arguments)}catch(F){qt("WebGLState:",F)}}function ft(){try{s.texStorage3D(...arguments)}catch(F){qt("WebGLState:",F)}}function K(){try{s.texImage2D(...arguments)}catch(F){qt("WebGLState:",F)}}function nt(){try{s.texImage3D(...arguments)}catch(F){qt("WebGLState:",F)}}function gt(F){return d[F]!==void 0?d[F]:s.getParameter(F)}function Ut(F,yt){d[F]!==yt&&(s.pixelStorei(F,yt),d[F]=yt)}function mt(F){he.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),he.copy(F))}function pt(F){Qt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Qt.copy(F))}function It(F,yt){let tt=c.get(yt);tt===void 0&&(tt=new WeakMap,c.set(yt,tt));let xt=tt.get(F);xt===void 0&&(xt=s.getUniformBlockIndex(yt,F.name),tt.set(F,xt))}function Bt(F,yt){let xt=c.get(yt).get(F);l.get(yt)!==xt&&(s.uniformBlockBinding(yt,xt,F.__bindingPointIndex),l.set(yt,xt))}function Zt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},j=null,Q={},u={},f=new WeakMap,p=[],g=null,m=!1,y=null,x=null,M=null,v=null,S=null,T=null,C=null,_=new St(0,0,0),A=0,R=!1,I=null,D=null,O=null,N=null,z=null,he.set(0,0,s.canvas.width,s.canvas.height),Qt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:J,disable:ut,bindFramebuffer:Ft,drawBuffers:Tt,useProgram:Wt,setBlending:rt,setMaterial:ot,setFlipSided:at,setCullFace:dt,setLineWidth:Vt,setPolygonOffset:Ot,setScissorTest:$t,activeTexture:Yt,bindTexture:U,unbindTexture:ue,compressedTexImage2D:te,compressedTexImage3D:P,texImage2D:K,texImage3D:nt,pixelStorei:Ut,getParameter:gt,updateUBOMapping:It,uniformBlockBinding:Bt,texStorage2D:ct,texStorage3D:ft,texSubImage2D:w,texSubImage3D:B,compressedTexSubImage2D:H,compressedTexSubImage3D:Z,scissor:mt,viewport:pt,reset:Zt}}function S1(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap,d=new Set,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,w){return p?new OffscreenCanvas(P,w):ho("canvas")}function m(P,w,B){let H=1,Z=te(P);if((Z.width>B||Z.height>B)&&(H=B/Math.max(Z.width,Z.height)),H<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let ct=Math.floor(H*Z.width),ft=Math.floor(H*Z.height);u===void 0&&(u=g(ct,ft));let K=w?g(ct,ft):u;return K.width=ct,K.height=ft,K.getContext("2d").drawImage(P,0,0,ct,ft),Xt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+ct+"x"+ft+")."),K}else return"data"in P&&Xt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),P;return P}function y(P){return P.generateMipmaps}function x(P){s.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function v(P,w,B,H,Z,ct=!1){if(P!==null){if(s[P]!==void 0)return s[P];Xt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ft;H&&(ft=t.get("EXT_texture_norm16"),ft||Xt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=w;if(w===s.RED&&(B===s.FLOAT&&(K=s.R32F),B===s.HALF_FLOAT&&(K=s.R16F),B===s.UNSIGNED_BYTE&&(K=s.R8),B===s.UNSIGNED_SHORT&&ft&&(K=ft.R16_EXT),B===s.SHORT&&ft&&(K=ft.R16_SNORM_EXT)),w===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(K=s.R8UI),B===s.UNSIGNED_SHORT&&(K=s.R16UI),B===s.UNSIGNED_INT&&(K=s.R32UI),B===s.BYTE&&(K=s.R8I),B===s.SHORT&&(K=s.R16I),B===s.INT&&(K=s.R32I)),w===s.RG&&(B===s.FLOAT&&(K=s.RG32F),B===s.HALF_FLOAT&&(K=s.RG16F),B===s.UNSIGNED_BYTE&&(K=s.RG8),B===s.UNSIGNED_SHORT&&ft&&(K=ft.RG16_EXT),B===s.SHORT&&ft&&(K=ft.RG16_SNORM_EXT)),w===s.RG_INTEGER&&(B===s.UNSIGNED_BYTE&&(K=s.RG8UI),B===s.UNSIGNED_SHORT&&(K=s.RG16UI),B===s.UNSIGNED_INT&&(K=s.RG32UI),B===s.BYTE&&(K=s.RG8I),B===s.SHORT&&(K=s.RG16I),B===s.INT&&(K=s.RG32I)),w===s.RGB_INTEGER&&(B===s.UNSIGNED_BYTE&&(K=s.RGB8UI),B===s.UNSIGNED_SHORT&&(K=s.RGB16UI),B===s.UNSIGNED_INT&&(K=s.RGB32UI),B===s.BYTE&&(K=s.RGB8I),B===s.SHORT&&(K=s.RGB16I),B===s.INT&&(K=s.RGB32I)),w===s.RGBA_INTEGER&&(B===s.UNSIGNED_BYTE&&(K=s.RGBA8UI),B===s.UNSIGNED_SHORT&&(K=s.RGBA16UI),B===s.UNSIGNED_INT&&(K=s.RGBA32UI),B===s.BYTE&&(K=s.RGBA8I),B===s.SHORT&&(K=s.RGBA16I),B===s.INT&&(K=s.RGBA32I)),w===s.RGB&&(B===s.UNSIGNED_SHORT&&ft&&(K=ft.RGB16_EXT),B===s.SHORT&&ft&&(K=ft.RGB16_SNORM_EXT),B===s.UNSIGNED_INT_5_9_9_9_REV&&(K=s.RGB9_E5),B===s.UNSIGNED_INT_10F_11F_11F_REV&&(K=s.R11F_G11F_B10F)),w===s.RGBA){let nt=ct?co:se.getTransfer(Z);B===s.FLOAT&&(K=s.RGBA32F),B===s.HALF_FLOAT&&(K=s.RGBA16F),B===s.UNSIGNED_BYTE&&(K=nt===ye?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT&&ft&&(K=ft.RGBA16_EXT),B===s.SHORT&&ft&&(K=ft.RGBA16_SNORM_EXT),B===s.UNSIGNED_SHORT_4_4_4_4&&(K=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(K=s.RGB5_A1)}return(K===s.R16F||K===s.R32F||K===s.RG16F||K===s.RG32F||K===s.RGBA16F||K===s.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function S(P,w){let B;return P?w===null||w===ti||w===is?B=s.DEPTH24_STENCIL8:w===zn?B=s.DEPTH32F_STENCIL8:w===Ar&&(B=s.DEPTH24_STENCIL8,Xt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ti||w===is?B=s.DEPTH_COMPONENT24:w===zn?B=s.DEPTH_COMPONENT32F:w===Ar&&(B=s.DEPTH_COMPONENT16),B}function T(P,w){return y(P)===!0||P.isFramebufferTexture&&P.minFilter!==Ve&&P.minFilter!==on?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function C(P){let w=P.target;w.removeEventListener("dispose",C),A(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&d.delete(w)}function _(P){let w=P.target;w.removeEventListener("dispose",_),I(w)}function A(P){let w=n.get(P);if(w.__webglInit===void 0)return;let B=P.source,H=f.get(B);if(H){let Z=H[w.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&R(P),Object.keys(H).length===0&&f.delete(B)}n.remove(P)}function R(P){let w=n.get(P);s.deleteTexture(w.__webglTexture);let B=P.source,H=f.get(B);delete H[w.__cacheKey],o.memory.textures--}function I(P){let w=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(w.__webglFramebuffer[H]))for(let Z=0;Z<w.__webglFramebuffer[H].length;Z++)s.deleteFramebuffer(w.__webglFramebuffer[H][Z]);else s.deleteFramebuffer(w.__webglFramebuffer[H]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[H])}else{if(Array.isArray(w.__webglFramebuffer))for(let H=0;H<w.__webglFramebuffer.length;H++)s.deleteFramebuffer(w.__webglFramebuffer[H]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let H=0;H<w.__webglColorRenderbuffer.length;H++)w.__webglColorRenderbuffer[H]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[H]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let B=P.textures;for(let H=0,Z=B.length;H<Z;H++){let ct=n.get(B[H]);ct.__webglTexture&&(s.deleteTexture(ct.__webglTexture),o.memory.textures--),n.remove(B[H])}n.remove(P)}let D=0;function O(){D=0}function N(){return D}function z(P){D=P}function q(){let P=D;return P>=i.maxTextures&&Xt("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),D+=1,P}function $(P){let w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function it(P,w){let B=n.get(P);if(P.isVideoTexture&&U(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&B.__version!==P.version){let H=P.image;if(H===null)Xt("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Xt("WebGLRenderer: Texture marked for update but image is incomplete");else{ut(B,P,w);return}}else P.isExternalTexture&&(B.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+w)}function W(P,w){let B=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&B.__version!==P.version){ut(B,P,w);return}else P.isExternalTexture&&(B.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+w)}function j(P,w){let B=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&B.__version!==P.version){ut(B,P,w);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+w)}function Q(P,w){let B=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&B.__version!==P.version){Ft(B,P,w);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+w)}let Rt={[Pn]:s.REPEAT,[ai]:s.CLAMP_TO_EDGE,[xl]:s.MIRRORED_REPEAT},At={[Ve]:s.NEAREST,[yp]:s.NEAREST_MIPMAP_NEAREST,[Jo]:s.NEAREST_MIPMAP_LINEAR,[on]:s.LINEAR,[jl]:s.LINEAR_MIPMAP_NEAREST,[ns]:s.LINEAR_MIPMAP_LINEAR},he={[Mp]:s.NEVER,[Ep]:s.ALWAYS,[wp]:s.LESS,[kc]:s.LEQUAL,[bp]:s.EQUAL,[Fc]:s.GEQUAL,[Sp]:s.GREATER,[Tp]:s.NOTEQUAL};function Qt(P,w){if(w.type===zn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===on||w.magFilter===jl||w.magFilter===Jo||w.magFilter===ns||w.minFilter===on||w.minFilter===jl||w.minFilter===Jo||w.minFilter===ns)&&Xt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,Rt[w.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,Rt[w.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,Rt[w.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,At[w.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,At[w.minFilter]),w.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,he[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Ve||w.minFilter!==Jo&&w.minFilter!==ns||w.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");s.texParameterf(P,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ie(P,w){let B=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",C));let H=w.source,Z=f.get(H);Z===void 0&&(Z={},f.set(H,Z));let ct=$(w);if(ct!==P.__cacheKey){Z[ct]===void 0&&(Z[ct]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Z[ct].usedTimes++;let ft=Z[P.__cacheKey];ft!==void 0&&(Z[P.__cacheKey].usedTimes--,ft.usedTimes===0&&R(w)),P.__cacheKey=ct,P.__webglTexture=Z[ct].texture}return B}function Y(P,w,B){return Math.floor(Math.floor(P/B)/w)}function J(P,w,B,H){let ct=P.updateRanges;if(ct.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,w.width,w.height,B,H,w.data);else{ct.sort((Ut,mt)=>Ut.start-mt.start);let ft=0;for(let Ut=1;Ut<ct.length;Ut++){let mt=ct[ft],pt=ct[Ut],It=mt.start+mt.count,Bt=Y(pt.start,w.width,4),Zt=Y(mt.start,w.width,4);pt.start<=It+1&&Bt===Zt&&Y(pt.start+pt.count-1,w.width,4)===Bt?mt.count=Math.max(mt.count,pt.start+pt.count-mt.start):(++ft,ct[ft]=pt)}ct.length=ft+1;let K=e.getParameter(s.UNPACK_ROW_LENGTH),nt=e.getParameter(s.UNPACK_SKIP_PIXELS),gt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,w.width);for(let Ut=0,mt=ct.length;Ut<mt;Ut++){let pt=ct[Ut],It=Math.floor(pt.start/4),Bt=Math.ceil(pt.count/4),Zt=It%w.width,F=Math.floor(It/w.width),yt=Bt,tt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Zt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Zt,F,yt,tt,B,H,w.data)}P.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,K),e.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(s.UNPACK_SKIP_ROWS,gt)}}function ut(P,w,B){let H=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(H=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(H=s.TEXTURE_3D);let Z=ie(P,w),ct=w.source;e.bindTexture(H,P.__webglTexture,s.TEXTURE0+B);let ft=n.get(ct);if(ct.version!==ft.__version||Z===!0){if(e.activeTexture(s.TEXTURE0+B),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let tt=se.getPrimaries(se.workingColorSpace),xt=w.colorSpace===Ii?null:se.getPrimaries(w.colorSpace),Et=w.colorSpace===Ii||tt===xt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et)}e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment);let nt=m(w.image,!1,i.maxTextureSize);nt=ue(w,nt);let gt=r.convert(w.format,w.colorSpace),Ut=r.convert(w.type),mt=v(w.internalFormat,gt,Ut,w.normalized,w.colorSpace,w.isVideoTexture);Qt(H,w);let pt,It=w.mipmaps,Bt=w.isVideoTexture!==!0,Zt=ft.__version===void 0||Z===!0,F=ct.dataReady,yt=T(w,nt);if(w.isDepthTexture)mt=S(w.format===ui,w.type),Zt&&(Bt?e.texStorage2D(s.TEXTURE_2D,1,mt,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,mt,nt.width,nt.height,0,gt,Ut,null));else if(w.isDataTexture)if(It.length>0){Bt&&Zt&&e.texStorage2D(s.TEXTURE_2D,yt,mt,It[0].width,It[0].height);for(let tt=0,xt=It.length;tt<xt;tt++)pt=It[tt],Bt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,pt.width,pt.height,gt,Ut,pt.data):e.texImage2D(s.TEXTURE_2D,tt,mt,pt.width,pt.height,0,gt,Ut,pt.data);w.generateMipmaps=!1}else Bt?(Zt&&e.texStorage2D(s.TEXTURE_2D,yt,mt,nt.width,nt.height),F&&J(w,nt,gt,Ut)):e.texImage2D(s.TEXTURE_2D,0,mt,nt.width,nt.height,0,gt,Ut,nt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Bt&&Zt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,mt,It[0].width,It[0].height,nt.depth);for(let tt=0,xt=It.length;tt<xt;tt++)if(pt=It[tt],w.format!==bn)if(gt!==null)if(Bt){if(F)if(w.layerUpdates.size>0){let Et=Xd(pt.width,pt.height,w.format,w.type);for(let st of w.layerUpdates){let zt=pt.data.subarray(st*Et/pt.data.BYTES_PER_ELEMENT,(st+1)*Et/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,st,pt.width,pt.height,1,gt,zt)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,pt.width,pt.height,nt.depth,gt,pt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,tt,mt,pt.width,pt.height,nt.depth,0,pt.data,0,0);else Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Bt?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,pt.width,pt.height,nt.depth,gt,Ut,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,tt,mt,pt.width,pt.height,nt.depth,0,gt,Ut,pt.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{Bt&&Zt&&e.texStorage2D(s.TEXTURE_2D,yt,mt,It[0].width,It[0].height);for(let tt=0,xt=It.length;tt<xt;tt++)pt=It[tt],w.format!==bn?gt!==null?Bt?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,tt,0,0,pt.width,pt.height,gt,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,tt,mt,pt.width,pt.height,0,pt.data):Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,pt.width,pt.height,gt,Ut,pt.data):e.texImage2D(s.TEXTURE_2D,tt,mt,pt.width,pt.height,0,gt,Ut,pt.data)}else if(w.isDataArrayTexture)if(Bt){if(Zt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,yt,mt,nt.width,nt.height,nt.depth),F)if(w.layerUpdates.size>0){let tt=Xd(nt.width,nt.height,w.format,w.type);for(let xt of w.layerUpdates){let Et=nt.data.subarray(xt*tt/nt.data.BYTES_PER_ELEMENT,(xt+1)*tt/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xt,nt.width,nt.height,1,gt,Ut,Et)}w.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,gt,Ut,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,mt,nt.width,nt.height,nt.depth,0,gt,Ut,nt.data);else if(w.isData3DTexture)Bt?(Zt&&e.texStorage3D(s.TEXTURE_3D,yt,mt,nt.width,nt.height,nt.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,gt,Ut,nt.data)):e.texImage3D(s.TEXTURE_3D,0,mt,nt.width,nt.height,nt.depth,0,gt,Ut,nt.data);else if(w.isFramebufferTexture){if(Zt)if(Bt)e.texStorage2D(s.TEXTURE_2D,yt,mt,nt.width,nt.height);else{let tt=nt.width,xt=nt.height;for(let Et=0;Et<yt;Et++)e.texImage2D(s.TEXTURE_2D,Et,mt,tt,xt,0,gt,Ut,null),tt>>=1,xt>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in s){let tt=s.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),nt.parentNode!==tt){tt.appendChild(nt),d.add(w),tt.onpaint=xt=>{let Et=xt.changedElements;for(let st of d)Et.includes(st.image)&&(st.needsUpdate=!0)},tt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,nt);else{let Et=s.RGBA,st=s.RGBA,zt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Et,st,zt,nt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(It.length>0){if(Bt&&Zt){let tt=te(It[0]);e.texStorage2D(s.TEXTURE_2D,yt,mt,tt.width,tt.height)}for(let tt=0,xt=It.length;tt<xt;tt++)pt=It[tt],Bt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,gt,Ut,pt):e.texImage2D(s.TEXTURE_2D,tt,mt,gt,Ut,pt);w.generateMipmaps=!1}else if(Bt){if(Zt){let tt=te(nt);e.texStorage2D(s.TEXTURE_2D,yt,mt,tt.width,tt.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,gt,Ut,nt)}else e.texImage2D(s.TEXTURE_2D,0,mt,gt,Ut,nt);y(w)&&x(H),ft.__version=ct.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Ft(P,w,B){if(w.image.length!==6)return;let H=ie(P,w),Z=w.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+B);let ct=n.get(Z);if(Z.version!==ct.__version||H===!0){e.activeTexture(s.TEXTURE0+B);let ft=se.getPrimaries(se.workingColorSpace),K=w.colorSpace===Ii?null:se.getPrimaries(w.colorSpace),nt=w.colorSpace===Ii||ft===K?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let gt=w.isCompressedTexture||w.image[0].isCompressedTexture,Ut=w.image[0]&&w.image[0].isDataTexture,mt=[];for(let st=0;st<6;st++)!gt&&!Ut?mt[st]=m(w.image[st],!0,i.maxCubemapSize):mt[st]=Ut?w.image[st].image:w.image[st],mt[st]=ue(w,mt[st]);let pt=mt[0],It=r.convert(w.format,w.colorSpace),Bt=r.convert(w.type),Zt=v(w.internalFormat,It,Bt,w.normalized,w.colorSpace),F=w.isVideoTexture!==!0,yt=ct.__version===void 0||H===!0,tt=Z.dataReady,xt=T(w,pt);Qt(s.TEXTURE_CUBE_MAP,w);let Et;if(gt){F&&yt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,Zt,pt.width,pt.height);for(let st=0;st<6;st++){Et=mt[st].mipmaps;for(let zt=0;zt<Et.length;zt++){let Nt=Et[zt];w.format!==bn?It!==null?F?tt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,0,0,Nt.width,Nt.height,It,Nt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,Zt,Nt.width,Nt.height,0,Nt.data):Xt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,0,0,Nt.width,Nt.height,It,Bt,Nt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt,Zt,Nt.width,Nt.height,0,It,Bt,Nt.data)}}}else{if(Et=w.mipmaps,F&&yt){Et.length>0&&xt++;let st=te(mt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,Zt,st.width,st.height)}for(let st=0;st<6;st++)if(Ut){F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,mt[st].width,mt[st].height,It,Bt,mt[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,mt[st].width,mt[st].height,0,It,Bt,mt[st].data);for(let zt=0;zt<Et.length;zt++){let Ae=Et[zt].image[st].image;F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,0,0,Ae.width,Ae.height,It,Bt,Ae.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,Zt,Ae.width,Ae.height,0,It,Bt,Ae.data)}}else{F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,It,Bt,mt[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,It,Bt,mt[st]);for(let zt=0;zt<Et.length;zt++){let Nt=Et[zt];F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,0,0,It,Bt,Nt.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,zt+1,Zt,It,Bt,Nt.image[st])}}}y(w)&&x(s.TEXTURE_CUBE_MAP),ct.__version=Z.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Tt(P,w,B,H,Z,ct){let ft=r.convert(B.format,B.colorSpace),K=r.convert(B.type),nt=v(B.internalFormat,ft,K,B.normalized,B.colorSpace),gt=n.get(w),Ut=n.get(B);if(Ut.__renderTarget=w,!gt.__hasExternalTextures){let mt=Math.max(1,w.width>>ct),pt=Math.max(1,w.height>>ct);Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?e.texImage3D(Z,ct,nt,mt,pt,w.depth,0,ft,K,null):e.texImage2D(Z,ct,nt,mt,pt,0,ft,K,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),Yt(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,H,Z,Ut.__webglTexture,0,$t(w)):(Z===s.TEXTURE_2D||Z>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,H,Z,Ut.__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Wt(P,w,B){if(s.bindRenderbuffer(s.RENDERBUFFER,P),w.depthBuffer){let H=w.depthTexture,Z=H&&H.isDepthTexture?H.type:null,ct=S(w.stencilBuffer,Z),ft=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Yt(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$t(w),ct,w.width,w.height):B?s.renderbufferStorageMultisample(s.RENDERBUFFER,$t(w),ct,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,ct,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ft,s.RENDERBUFFER,P)}else{let H=w.textures;for(let Z=0;Z<H.length;Z++){let ct=H[Z],ft=r.convert(ct.format,ct.colorSpace),K=r.convert(ct.type),nt=v(ct.internalFormat,ft,K,ct.normalized,ct.colorSpace);Yt(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$t(w),nt,w.width,w.height):B?s.renderbufferStorageMultisample(s.RENDERBUFFER,$t(w),nt,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,nt,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function pe(P,w,B){let H=w.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=n.get(w.depthTexture);if(Z.__renderTarget=w,(!Z.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),H){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,w.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),Qt(s.TEXTURE_CUBE_MAP,w.depthTexture);let gt=r.convert(w.depthTexture.format),Ut=r.convert(w.depthTexture.type),mt;w.depthTexture.format===li?mt=s.DEPTH_COMPONENT24:w.depthTexture.format===ui&&(mt=s.DEPTH24_STENCIL8);for(let pt=0;pt<6;pt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,mt,w.width,w.height,0,gt,Ut,null)}}else it(w.depthTexture,0);let ct=Z.__webglTexture,ft=$t(w),K=H?s.TEXTURE_CUBE_MAP_POSITIVE_X+B:s.TEXTURE_2D,nt=w.depthTexture.format===ui?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(w.depthTexture.format===li)Yt(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,K,ct,0,ft):s.framebufferTexture2D(s.FRAMEBUFFER,nt,K,ct,0);else if(w.depthTexture.format===ui)Yt(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,K,ct,0,ft):s.framebufferTexture2D(s.FRAMEBUFFER,nt,K,ct,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(P){let w=n.get(P),B=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){let H=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),H){let Z=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,H.removeEventListener("dispose",Z)};H.addEventListener("dispose",Z),w.__depthDisposeCallback=Z}w.__boundDepthTexture=H}if(P.depthTexture&&!w.__autoAllocateDepthBuffer)if(B)for(let H=0;H<6;H++)pe(w.__webglFramebuffer[H],P,H);else{let H=P.texture.mipmaps;H&&H.length>0?pe(w.__webglFramebuffer[0],P,0):pe(w.__webglFramebuffer,P,0)}else if(B){w.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[H]),w.__webglDepthbuffer[H]===void 0)w.__webglDepthbuffer[H]=s.createRenderbuffer(),Wt(w.__webglDepthbuffer[H],P,!1);else{let Z=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=w.__webglDepthbuffer[H];s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,ct)}}else{let H=P.texture.mipmaps;if(H&&H.length>0?e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),Wt(w.__webglDepthbuffer,P,!1);else{let Z=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,ct)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(P,w,B){let H=n.get(P);w!==void 0&&Tt(H.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&et(P)}function ot(P){let w=P.texture,B=n.get(P),H=n.get(w);P.addEventListener("dispose",_);let Z=P.textures,ct=P.isWebGLCubeRenderTarget===!0,ft=Z.length>1;if(ft||(H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture()),H.__version=w.version,o.memory.textures++),ct){B.__webglFramebuffer=[];for(let K=0;K<6;K++)if(w.mipmaps&&w.mipmaps.length>0){B.__webglFramebuffer[K]=[];for(let nt=0;nt<w.mipmaps.length;nt++)B.__webglFramebuffer[K][nt]=s.createFramebuffer()}else B.__webglFramebuffer[K]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){B.__webglFramebuffer=[];for(let K=0;K<w.mipmaps.length;K++)B.__webglFramebuffer[K]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(ft)for(let K=0,nt=Z.length;K<nt;K++){let gt=n.get(Z[K]);gt.__webglTexture===void 0&&(gt.__webglTexture=s.createTexture(),o.memory.textures++)}if(P.samples>0&&Yt(P)===!1){B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let K=0;K<Z.length;K++){let nt=Z[K];B.__webglColorRenderbuffer[K]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[K]);let gt=r.convert(nt.format,nt.colorSpace),Ut=r.convert(nt.type),mt=v(nt.internalFormat,gt,Ut,nt.normalized,nt.colorSpace,P.isXRRenderTarget===!0),pt=$t(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,pt,mt,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+K,s.RENDERBUFFER,B.__webglColorRenderbuffer[K])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),Wt(B.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture),Qt(s.TEXTURE_CUBE_MAP,w);for(let K=0;K<6;K++)if(w.mipmaps&&w.mipmaps.length>0)for(let nt=0;nt<w.mipmaps.length;nt++)Tt(B.__webglFramebuffer[K][nt],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+K,nt);else Tt(B.__webglFramebuffer[K],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);y(w)&&x(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ft){for(let K=0,nt=Z.length;K<nt;K++){let gt=Z[K],Ut=n.get(gt),mt=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(mt=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(mt,Ut.__webglTexture),Qt(mt,gt),Tt(B.__webglFramebuffer,P,gt,s.COLOR_ATTACHMENT0+K,mt,0),y(gt)&&x(mt)}e.unbindTexture()}else{let K=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(K=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(K,H.__webglTexture),Qt(K,w),w.mipmaps&&w.mipmaps.length>0)for(let nt=0;nt<w.mipmaps.length;nt++)Tt(B.__webglFramebuffer[nt],P,w,s.COLOR_ATTACHMENT0,K,nt);else Tt(B.__webglFramebuffer,P,w,s.COLOR_ATTACHMENT0,K,0);y(w)&&x(K),e.unbindTexture()}P.depthBuffer&&et(P)}function at(P){let w=P.textures;for(let B=0,H=w.length;B<H;B++){let Z=w[B];if(y(Z)){let ct=M(P),ft=n.get(Z).__webglTexture;e.bindTexture(ct,ft),x(ct),e.unbindTexture()}}}let dt=[],Vt=[];function Ot(P){if(P.samples>0){if(Yt(P)===!1){let w=P.textures,B=P.width,H=P.height,Z=s.COLOR_BUFFER_BIT,ct=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ft=n.get(P),K=w.length>1;if(K)for(let gt=0;gt<w.length;gt++)e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer);let nt=P.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let gt=0;gt<w.length;gt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Z|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Z|=s.STENCIL_BUFFER_BIT)),K){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ft.__webglColorRenderbuffer[gt]);let Ut=n.get(w[gt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ut,0)}s.blitFramebuffer(0,0,B,H,0,0,B,H,Z,s.NEAREST),l===!0&&(dt.length=0,Vt.length=0,dt.push(s.COLOR_ATTACHMENT0+gt),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(dt.push(ct),Vt.push(ct),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Vt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,dt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),K)for(let gt=0;gt<w.length;gt++){e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,ft.__webglColorRenderbuffer[gt]);let Ut=n.get(w[gt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ft.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,Ut,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let w=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function $t(P){return Math.min(i.maxSamples,P.samples)}function Yt(P){let w=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function U(P){let w=o.render.frame;h.get(P)!==w&&(h.set(P,w),P.update())}function ue(P,w){let B=P.colorSpace,H=P.format,Z=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||B!==lo&&B!==Ii&&(se.getTransfer(B)===ye?(H!==bn||Z!==pn)&&Xt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qt("WebGLTextures: Unsupported texture color space:",B)),w}function te(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=O,this.getTextureUnits=N,this.setTextureUnits=z,this.setTexture2D=it,this.setTexture2DArray=W,this.setTexture3D=j,this.setTextureCube=Q,this.rebindTextures=rt,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=Ot,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=Yt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function T1(s,t){function e(n,i=Ii){let r,o=se.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===tc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===ec)return s.UNSIGNED_SHORT_5_5_5_1;if(n===kd)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Fd)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Nd)return s.BYTE;if(n===Ud)return s.SHORT;if(n===Ar)return s.UNSIGNED_SHORT;if(n===Ql)return s.INT;if(n===ti)return s.UNSIGNED_INT;if(n===zn)return s.FLOAT;if(n===sn)return s.HALF_FLOAT;if(n===Od)return s.ALPHA;if(n===Bd)return s.RGB;if(n===bn)return s.RGBA;if(n===li)return s.DEPTH_COMPONENT;if(n===ui)return s.DEPTH_STENCIL;if(n===nc)return s.RED;if(n===ic)return s.RED_INTEGER;if(n===ss)return s.RG;if(n===sc)return s.RG_INTEGER;if(n===rc)return s.RGBA_INTEGER;if(n===jo||n===Qo||n===ta||n===ea)if(o===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===jo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===jo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ea)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===oc||n===ac||n===lc||n===cc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===oc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ac)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===lc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===cc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===hc||n===dc||n===uc||n===fc||n===pc||n===na||n===mc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===hc||n===dc)return o===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===uc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===fc)return r.COMPRESSED_R11_EAC;if(n===pc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===na)return r.COMPRESSED_RG11_EAC;if(n===mc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===gc||n===yc||n===xc||n===vc||n===_c||n===Mc||n===wc||n===bc||n===Sc||n===Tc||n===Ec||n===Ac||n===Cc||n===Rc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===gc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===yc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_c)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Mc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Sc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Tc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ec)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ac)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Cc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Rc)return o===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pc||n===Ic||n===Lc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Pc)return o===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ic)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Lc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Dc||n===Nc||n===ia||n===Uc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Dc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Nc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Uc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===is?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var E1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,A1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,du=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new So(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ie({vertexShader:E1,fragmentShader:A1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new Ts(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},uu=class extends ci{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null,g=typeof XRWebGLBinding<"u",m=new du,y={},x=e.getContextAttributes(),M=null,v=null,S=[],T=[],C=new ht,_=null,A=null,R=new fn;R.viewport=new Ue;let I=new fn;I.viewport=new Ue;let D=[R,I],O=new Xl,N=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let J=S[Y];return J===void 0&&(J=new gr,S[Y]=J),J.getTargetRaySpace()},this.getControllerGrip=function(Y){let J=S[Y];return J===void 0&&(J=new gr,S[Y]=J),J.getGripSpace()},this.getHand=function(Y){let J=S[Y];return J===void 0&&(J=new gr,S[Y]=J),J.getHandSpace()};function q(Y){let J=T.indexOf(Y.inputSource);if(J===-1)return;let ut=S[J];ut!==void 0&&(ut.update(Y.inputSource,Y.frame,c||o),ut.dispatchEvent({type:Y.type,data:Y.inputSource}))}function $(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",it);for(let Y=0;Y<S.length;Y++){let J=T[Y];J!==null&&(T[Y]=null,S[Y].disconnect(J))}N=null,z=null,m.reset();for(let Y in y)delete y[Y];if(t.setRenderTarget(M),f=null,u=null,d=null,i=null,v=null,ie.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&Xt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&Xt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(M=t.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",$),i.addEventListener("inputsourceschange",it),x.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let ut=null,Ft=null,Tt=null;x.depth&&(Tt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ut=x.stencil?ui:li,Ft=x.stencil?is:ti);let Wt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Wt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new Ge(u.textureWidth,u.textureHeight,{format:bn,type:pn,depthTexture:new di(u.textureWidth,u.textureHeight,Ft,void 0,void 0,void 0,void 0,void 0,void 0,ut),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let ut={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,ut),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Ge(f.framebufferWidth,f.framebufferHeight,{format:bn,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ie.setContext(i),ie.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function it(Y){for(let J=0;J<Y.removed.length;J++){let ut=Y.removed[J],Ft=T.indexOf(ut);Ft>=0&&(T[Ft]=null,S[Ft].disconnect(ut))}for(let J=0;J<Y.added.length;J++){let ut=Y.added[J],Ft=T.indexOf(ut);if(Ft===-1){for(let Wt=0;Wt<S.length;Wt++)if(Wt>=T.length){T.push(ut),Ft=Wt;break}else if(T[Wt]===null){T[Wt]=ut,Ft=Wt;break}if(Ft===-1)break}let Tt=S[Ft];Tt&&Tt.connect(ut)}}let W=new L,j=new L;function Q(Y,J,ut){W.setFromMatrixPosition(J.matrixWorld),j.setFromMatrixPosition(ut.matrixWorld);let Ft=W.distanceTo(j),Tt=J.projectionMatrix.elements,Wt=ut.projectionMatrix.elements,pe=Tt[14]/(Tt[10]-1),et=Tt[14]/(Tt[10]+1),rt=(Tt[9]+1)/Tt[5],ot=(Tt[9]-1)/Tt[5],at=(Tt[8]-1)/Tt[0],dt=(Wt[8]+1)/Wt[0],Vt=pe*at,Ot=pe*dt,$t=Ft/(-at+dt),Yt=$t*-at;if(J.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Yt),Y.translateZ($t),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let U=pe+$t,ue=et+$t,te=Vt-Yt,P=Ot+(Ft-Yt),w=rt*et/ue*U,B=ot*et/ue*U;Y.projectionMatrix.makePerspective(te,P,w,B,U,ue),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Rt(Y,J){J===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(J.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let J=Y.near,ut=Y.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(ut=m.depthFar)),O.near=I.near=R.near=J,O.far=I.far=R.far=ut,(N!==O.near||z!==O.far)&&(i.updateRenderState({depthNear:O.near,depthFar:O.far}),N=O.near,z=O.far),O.layers.mask=Y.layers.mask|6,R.layers.mask=O.layers.mask&-5,I.layers.mask=O.layers.mask&-3;let Ft=Y.parent,Tt=O.cameras;Rt(O,Ft);for(let Wt=0;Wt<Tt.length;Wt++)Rt(Tt[Wt],Ft);Tt.length===2?Q(O,R,I):O.projectionMatrix.copy(R.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),At(Y,O,Ft)};function At(Y,J,ut){ut===null?Y.matrix.copy(J.matrixWorld):(Y.matrix.copy(ut.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(J.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(J.projectionMatrix),Y.projectionMatrixInverse.copy(J.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=_l*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(Y){return y[Y]};let he=null;function Qt(Y,J){if(h=J.getViewerPose(c||o),p=J,h!==null){let ut=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Ft=!1;ut.length!==O.cameras.length&&(O.cameras.length=0,Ft=!0);for(let et=0;et<ut.length;et++){let rt=ut[et],ot=null;if(f!==null)ot=f.getViewport(rt);else{let dt=d.getViewSubImage(u,rt);ot=dt.viewport,et===0&&(t.setRenderTargetTextures(v,dt.colorTexture,dt.depthStencilTexture),t.setRenderTarget(v))}let at=D[et];at===void 0&&(at=new fn,at.layers.enable(et),at.viewport=new Ue,D[et]=at),at.matrix.fromArray(rt.transform.matrix),at.matrix.decompose(at.position,at.quaternion,at.scale),at.projectionMatrix.fromArray(rt.projectionMatrix),at.projectionMatrixInverse.copy(at.projectionMatrix).invert(),at.viewport.set(ot.x,ot.y,ot.width,ot.height),et===0&&(O.matrix.copy(at.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Ft===!0&&O.cameras.push(at)}let Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){d=n.getBinding();let et=d.getDepthInformation(ut[0]);et&&et.isValid&&et.texture&&m.init(et,i.renderState)}if(Tt&&Tt.includes("camera-access")&&g){t.state.unbindTexture(),d=n.getBinding();for(let et=0;et<ut.length;et++){let rt=ut[et].camera;if(rt){let ot=y[rt];ot||(ot=new So,y[rt]=ot);let at=d.getCameraImage(rt);ot.sourceTexture=at}}}}for(let ut=0;ut<S.length;ut++){let Ft=T[ut],Tt=S[ut];Ft!==null&&Tt!==void 0&&Tt.update(Ft,J,c||o)}he&&he(Y,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),p=null}let ie=new om;ie.setAnimationLoop(Qt),this.setAnimationLoop=function(Y){he=Y},this.dispose=function(){}}},C1=new ce,um=new jt;um.set(-1,0,0,0,1,0,0,0,1);function R1(s,t){function e(m,y){m.matrixAutoUpdate===!0&&m.updateMatrix(),y.value.copy(m.matrix)}function n(m,y){y.color.getRGB(m.fogColor.value,Gd(s)),y.isFog?(m.fogNear.value=y.near,m.fogFar.value=y.far):y.isFogExp2&&(m.fogDensity.value=y.density)}function i(m,y,x,M,v){y.isNodeMaterial?y.uniformsNeedUpdate=!1:y.isMeshBasicMaterial?r(m,y):y.isMeshLambertMaterial?(r(m,y),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)):y.isMeshToonMaterial?(r(m,y),d(m,y)):y.isMeshPhongMaterial?(r(m,y),h(m,y),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)):y.isMeshStandardMaterial?(r(m,y),u(m,y),y.isMeshPhysicalMaterial&&f(m,y,v)):y.isMeshMatcapMaterial?(r(m,y),p(m,y)):y.isMeshDepthMaterial?r(m,y):y.isMeshDistanceMaterial?(r(m,y),g(m,y)):y.isMeshNormalMaterial?r(m,y):y.isLineBasicMaterial?(o(m,y),y.isLineDashedMaterial&&a(m,y)):y.isPointsMaterial?l(m,y,x,M):y.isSpriteMaterial?c(m,y):y.isShadowMaterial?(m.color.value.copy(y.color),m.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function r(m,y){m.opacity.value=y.opacity,y.color&&m.diffuse.value.copy(y.color),y.emissive&&m.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(m.map.value=y.map,e(y.map,m.mapTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,e(y.alphaMap,m.alphaMapTransform)),y.bumpMap&&(m.bumpMap.value=y.bumpMap,e(y.bumpMap,m.bumpMapTransform),m.bumpScale.value=y.bumpScale,y.side===Je&&(m.bumpScale.value*=-1)),y.normalMap&&(m.normalMap.value=y.normalMap,e(y.normalMap,m.normalMapTransform),m.normalScale.value.copy(y.normalScale),y.side===Je&&m.normalScale.value.negate()),y.displacementMap&&(m.displacementMap.value=y.displacementMap,e(y.displacementMap,m.displacementMapTransform),m.displacementScale.value=y.displacementScale,m.displacementBias.value=y.displacementBias),y.emissiveMap&&(m.emissiveMap.value=y.emissiveMap,e(y.emissiveMap,m.emissiveMapTransform)),y.specularMap&&(m.specularMap.value=y.specularMap,e(y.specularMap,m.specularMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest);let x=t.get(y),M=x.envMap,v=x.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(C1.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(um),m.reflectivity.value=y.reflectivity,m.ior.value=y.ior,m.refractionRatio.value=y.refractionRatio),y.lightMap&&(m.lightMap.value=y.lightMap,m.lightMapIntensity.value=y.lightMapIntensity,e(y.lightMap,m.lightMapTransform)),y.aoMap&&(m.aoMap.value=y.aoMap,m.aoMapIntensity.value=y.aoMapIntensity,e(y.aoMap,m.aoMapTransform))}function o(m,y){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,y.map&&(m.map.value=y.map,e(y.map,m.mapTransform))}function a(m,y){m.dashSize.value=y.dashSize,m.totalSize.value=y.dashSize+y.gapSize,m.scale.value=y.scale}function l(m,y,x,M){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,m.size.value=y.size*x,m.scale.value=M*.5,y.map&&(m.map.value=y.map,e(y.map,m.uvTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,e(y.alphaMap,m.alphaMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest)}function c(m,y){m.diffuse.value.copy(y.color),m.opacity.value=y.opacity,m.rotation.value=y.rotation,y.map&&(m.map.value=y.map,e(y.map,m.mapTransform)),y.alphaMap&&(m.alphaMap.value=y.alphaMap,e(y.alphaMap,m.alphaMapTransform)),y.alphaTest>0&&(m.alphaTest.value=y.alphaTest)}function h(m,y){m.specular.value.copy(y.specular),m.shininess.value=Math.max(y.shininess,1e-4)}function d(m,y){y.gradientMap&&(m.gradientMap.value=y.gradientMap)}function u(m,y){m.metalness.value=y.metalness,y.metalnessMap&&(m.metalnessMap.value=y.metalnessMap,e(y.metalnessMap,m.metalnessMapTransform)),m.roughness.value=y.roughness,y.roughnessMap&&(m.roughnessMap.value=y.roughnessMap,e(y.roughnessMap,m.roughnessMapTransform)),y.envMap&&(m.envMapIntensity.value=y.envMapIntensity)}function f(m,y,x){m.ior.value=y.ior,y.sheen>0&&(m.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),m.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(m.sheenColorMap.value=y.sheenColorMap,e(y.sheenColorMap,m.sheenColorMapTransform)),y.sheenRoughnessMap&&(m.sheenRoughnessMap.value=y.sheenRoughnessMap,e(y.sheenRoughnessMap,m.sheenRoughnessMapTransform))),y.clearcoat>0&&(m.clearcoat.value=y.clearcoat,m.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(m.clearcoatMap.value=y.clearcoatMap,e(y.clearcoatMap,m.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,e(y.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(m.clearcoatNormalMap.value=y.clearcoatNormalMap,e(y.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===Je&&m.clearcoatNormalScale.value.negate())),y.dispersion>0&&(m.dispersion.value=y.dispersion),y.retroreflectivity>0&&(m.retroreflectivity.value=y.retroreflectivity),y.iridescence>0&&(m.iridescence.value=y.iridescence,m.iridescenceIOR.value=y.iridescenceIOR,m.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(m.iridescenceMap.value=y.iridescenceMap,e(y.iridescenceMap,m.iridescenceMapTransform)),y.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=y.iridescenceThicknessMap,e(y.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),y.transmission>0&&(m.transmission.value=y.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),y.transmissionMap&&(m.transmissionMap.value=y.transmissionMap,e(y.transmissionMap,m.transmissionMapTransform)),m.thickness.value=y.thickness,y.thicknessMap&&(m.thicknessMap.value=y.thicknessMap,e(y.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=y.attenuationDistance,m.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(m.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(m.anisotropyMap.value=y.anisotropyMap,e(y.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=y.specularIntensity,m.specularColor.value.copy(y.specularColor),y.specularColorMap&&(m.specularColorMap.value=y.specularColorMap,e(y.specularColorMap,m.specularColorMapTransform)),y.specularIntensityMap&&(m.specularIntensityMap.value=y.specularIntensityMap,e(y.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,y){y.matcap&&(m.matcap.value=y.matcap)}function g(m,y){let x=t.get(y).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function P1(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){let T=S.program;n.uniformBlockBinding(v,T)}function c(v,S){let T=i[v.id];T===void 0&&(m(v),T=h(v),i[v.id]=T,v.addEventListener("dispose",x));let C=S.program;n.updateUBOMapping(v,C);let _=t.render.frame;r[v.id]!==_&&(u(v),r[v.id]=_)}function h(v){let S=d();v.__bindingPointIndex=S;let T=s.createBuffer(),C=v.__size,_=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,C,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,T),T}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return qt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let S=i[v.id],T=v.uniforms,C=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let _=0,A=T.length;_<A;_++){let R=T[_];if(Array.isArray(R))for(let I=0,D=R.length;I<D;I++)f(R[I],_,I,C);else f(R,_,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(v,S,T,C){if(g(v,S,T,C)===!0){let _=v.__offset,A=v.value;if(Array.isArray(A)){let R=0;for(let I=0;I<A.length;I++){let D=A[I],O=y(D);p(D,v.__data,R),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(R+=O.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(A,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,v.__data)}}function p(v,S,T){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,T)}function g(v,S,T,C){let _=v.value,A=S+"_"+T;if(C[A]===void 0)return typeof _=="number"||typeof _=="boolean"?C[A]=_:ArrayBuffer.isView(_)?C[A]=_.slice():C[A]=_.clone(),!0;{let R=C[A];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function m(v){let S=v.uniforms,T=0,C=16;for(let A=0,R=S.length;A<R;A++){let I=Array.isArray(S[A])?S[A]:[S[A]];for(let D=0,O=I.length;D<O;D++){let N=I[D],z=Array.isArray(N.value)?N.value:[N.value];for(let q=0,$=z.length;q<$;q++){let it=z[q],W=y(it),j=T%C,Q=j%W.boundary,Rt=j+Q;T+=Q,Rt!==0&&C-Rt<W.storage&&(T+=C-Rt),N.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=T,T+=W.storage}}}let _=T%C;return _>0&&(T+=C-_),v.__size=T,v.__cache={},this}function y(v){let S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?Xt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):Xt("WebGLRenderer: Unsupported uniform value type.",v),S}function x(v){let S=v.target;S.removeEventListener("dispose",x);let T=o.indexOf(S.__bindingPointIndex);o.splice(T,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function M(){for(let v in i)s.deleteBuffer(i[v]);o=[],i={},r={}}return{bind:l,update:c,dispose:M}}var I1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),fi=null;function L1(){return fi===null&&(fi=new Ai(I1,16,16,ss,sn),fi.name="DFG_LUT",fi.minFilter=on,fi.magFilter=on,fi.wrapS=ai,fi.wrapT=ai,fi.generateMipmaps=!1,fi.needsUpdate=!0),fi}var Hc=class{constructor(t={}){let{canvas:e=Cp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=pn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=f,m=new Set([rc,sc,ic]),y=new Set([pn,ti,Ar,is,tc,ec]),x=new Uint32Array(4),M=new Int32Array(4),v=new L,S=null,T=null,C=[],_=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,D=null,O=null,N=null,z=null;this._outputColorSpace=xn;let q=0,$=0,it=null,W=-1,j=null,Q=new Ue,Rt=new Ue,At=null,he=new St(0),Qt=0,ie=e.width,Y=e.height,J=1,ut=null,Ft=null,Tt=new Ue(0,0,ie,Y),Wt=new Ue(0,0,ie,Y),pe=!1,et=new yr,rt=!1,ot=!1,at=new ce,dt=new L,Vt=new Ue,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$t=!1;function Yt(){return it===null?J:1}let U=n;function ue(E,k){return e.getContext(E,k)}let te,P,w,B,H,Z,ct,ft,K,nt,gt,Ut,mt,pt,It,Bt,Zt,F,yt,tt,xt,Et,st;try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",xe,!1),e.addEventListener("webglcontextcreationerror",Vn,!1),U===null){let k="webgl2";if(U=ue(k,E),U===null)throw ue(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}zt()}catch(E){throw e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",Vn,!1),qt("WebGLRenderer: "+E.message),E}function zt(){te=new Bv(U),te.init(),xt=new T1(U,te),P=new Rv(U,te,t,xt),w=new b1(U,te),P.reversedDepthBuffer&&u&&w.buffers.depth.setReversed(!0),O=U.createFramebuffer(),N=U.createFramebuffer(),z=U.createFramebuffer(),B=new Vv(U),H=new c1,Z=new S1(U,te,w,H,P,xt,B),ct=new Ov(R),ft=new Wg(U),Et=new Av(U,ft),K=new zv(U,ft,B,Et),nt=new Wv(U,K,ft,Et,B),F=new Gv(U,P,Z),It=new Pv(H),gt=new l1(R,ct,te,P,Et,It),Ut=new R1(R,H),mt=new d1,pt=new y1(te),Zt=new Ev(R,ct,w,nt,p,l),Bt=new w1(R,nt,P),st=new P1(U,B,P,w),yt=new Cv(U,te,B),tt=new Hv(U,te,B),B.programs=gt.programs,R.capabilities=P,R.extensions=te,R.properties=H,R.renderLists=mt,R.shadowMap=Bt,R.state=w,R.info=B}g!==pn&&(A=new Xv(g,e.width,e.height,a,i,r));let Nt=new uu(R,U);this.xr=Nt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let E=te.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=te.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(E){E!==void 0&&(J=E,this.setSize(ie,Y,!1))},this.getSize=function(E){return E.set(ie,Y)},this.setSize=function(E,k,X=!0){if(Nt.isPresenting){Xt("WebGLRenderer: Can't change size while VR device is presenting.");return}ie=E,Y=k,e.width=Math.floor(E*J),e.height=Math.floor(k*J),X===!0&&(e.style.width=E+"px",e.style.height=k+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(ie*J,Y*J).floor()},this.setDrawingBufferSize=function(E,k,X){ie=E,Y=k,J=X,e.width=Math.floor(E*X),e.height=Math.floor(k*X),this.setViewport(0,0,E,k)},this.setEffects=function(E){if(g===pn){qt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let k=0;k<E.length;k++)if(E[k].isOutputPass===!0){Xt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(Q)},this.getViewport=function(E){return E.copy(Tt)},this.setViewport=function(E,k,X,V){E.isVector4?Tt.set(E.x,E.y,E.z,E.w):Tt.set(E,k,X,V),w.viewport(Q.copy(Tt).multiplyScalar(J).round())},this.getScissor=function(E){return E.copy(Wt)},this.setScissor=function(E,k,X,V){E.isVector4?Wt.set(E.x,E.y,E.z,E.w):Wt.set(E,k,X,V),w.scissor(Rt.copy(Wt).multiplyScalar(J).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(E){w.setScissorTest(pe=E)},this.setOpaqueSort=function(E){ut=E},this.setTransparentSort=function(E){Ft=E},this.getClearColor=function(E){return E.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor(...arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha(...arguments)},this.clear=function(E=!0,k=!0,X=!0){let V=0;if(E){let G=!1;if(it!==null){let Mt=it.texture.format;G=m.has(Mt)}if(G){let Mt=it.texture.type,Pt=y.has(Mt),_t=Zt.getClearColor(),Lt=Zt.getClearAlpha(),kt=_t.r,ee=_t.g,re=_t.b;Pt?(x[0]=kt,x[1]=ee,x[2]=re,x[3]=Lt,U.clearBufferuiv(U.COLOR,0,x)):(M[0]=kt,M[1]=ee,M[2]=re,M[3]=Lt,U.clearBufferiv(U.COLOR,0,M))}else V|=U.COLOR_BUFFER_BIT}k&&(V|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(V|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&U.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),D=E},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",xe,!1),e.removeEventListener("webglcontextcreationerror",Vn,!1),Zt.dispose(),mt.dispose(),pt.dispose(),H.dispose(),ct.dispose(),nt.dispose(),Et.dispose(),st.dispose(),gt.dispose(),Nt.dispose(),Nt.removeEventListener("sessionstart",Du),Nt.removeEventListener("sessionend",Nu),hs.stop()};function Ae(E){E.preventDefault(),Hd("WebGLRenderer: Context Lost."),I=!0}function xe(){Hd("WebGLRenderer: Context Restored."),I=!1;let E=B.autoReset,k=Bt.enabled,X=Bt.autoUpdate,V=Bt.needsUpdate,G=Bt.type;zt(),B.autoReset=E,Bt.enabled=k,Bt.autoUpdate=X,Bt.needsUpdate=V,Bt.type=G}function Vn(E){qt("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ii(E){let k=E.target;k.removeEventListener("dispose",ii),e0(k)}function e0(E){n0(E),H.remove(E)}function n0(E){let k=H.get(E).programs;k!==void 0&&(k.forEach(function(X){gt.releaseProgram(X)}),E.isShaderMaterial&&gt.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,X,V,G,Mt){k===null&&(k=Ot);let Pt=G.isMesh&&G.matrixWorld.determinantAffine()<0,_t=r0(E,k,X,V,G);w.setMaterial(V,Pt);let Lt=X.index,kt=1;if(V.wireframe===!0){if(Lt=K.getWireframeAttribute(X),Lt===void 0)return;kt=2}let ee=X.drawRange,re=X.attributes.position,Dt=ee.start*kt,ve=(ee.start+ee.count)*kt;Mt!==null&&(Dt=Math.max(Dt,Mt.start*kt),ve=Math.min(ve,(Mt.start+Mt.count)*kt)),Lt!==null?(Dt=Math.max(Dt,0),ve=Math.min(ve,Lt.count)):re!=null&&(Dt=Math.max(Dt,0),ve=Math.min(ve,re.count));let $e=ve-Dt;if($e<0||$e===1/0)return;Et.setup(G,V,_t,X,Lt);let Le,Se=yt;if(Lt!==null&&(Le=ft.get(Lt),Se=tt,Se.setIndex(Le)),G.isMesh)V.wireframe===!0?(w.setLineWidth(V.wireframeLinewidth*Yt()),Se.setMode(U.LINES)):Se.setMode(U.TRIANGLES);else if(G.isLine){let ln=V.linewidth;ln===void 0&&(ln=1),w.setLineWidth(ln*Yt()),G.isLineSegments?Se.setMode(U.LINES):G.isLineLoop?Se.setMode(U.LINE_LOOP):Se.setMode(U.LINE_STRIP)}else G.isPoints?Se.setMode(U.POINTS):G.isSprite&&Se.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(te.get("WEBGL_multi_draw"))Se.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let ln=G._multiDrawStarts,Ct=G._multiDrawCounts,yn=G._multiDrawCount,me=Lt?ft.get(Lt).bytesPerElement:1,Un=H.get(V).currentProgram.getUniforms();for(let si=0;si<yn;si++)Un.setValue(U,"_gl_DrawID",si),Se.render(ln[si]/me,Ct[si])}else if(G.isInstancedMesh)Se.renderInstances(Dt,$e,G.count);else if(X.isInstancedBufferGeometry){let ln=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ct=Math.min(X.instanceCount,ln);Se.renderInstances(Dt,$e,Ct)}else Se.render(Dt,$e)};function Lu(E,k,X,V){D!==null&&E.isNodeMaterial&&D.setObject(V,E),rt===!0&&It.setState(E,X,!1),E.transparent===!0&&E.side===On&&E.forceSinglePass===!1?(E.side=Je,E.needsUpdate=!0,va(E,k,V),E.side=ts,E.needsUpdate=!0,va(E,k,V),E.side=On):va(E,k,V)}this.compile=function(E,k,X=null){X===null&&(X=E),D!==null&&D.renderStart(E,k,X),T=pt.get(X),T.init(k),_.push(T),X.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),E!==X&&E.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),D!==null&&D.updateLights(T.state.lightsArray),ot=this.localClippingEnabled,rt=It.init(this.clippingPlanes,ot),rt===!0&&It.setGlobalState(this.clippingPlanes,k),D!==null&&Bt.render(T.state.shadowsArray,X,k);let V=new Set;return E.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let Mt=G.material;if(Mt)if(Array.isArray(Mt))for(let Pt=0;Pt<Mt.length;Pt++){let _t=Mt[Pt];Lu(_t,X,k,G),V.add(_t)}else Lu(Mt,X,k,G),V.add(Mt)}),T=_.pop(),D!==null&&D.renderEnd(),V},this.compileAsync=function(E,k,X=null){let V=this.compile(E,k,X);return new Promise(G=>{function Mt(){if(V.forEach(function(Pt){let Lt=H.get(Pt).currentProgram;(Lt===void 0||Lt.isReady())&&V.delete(Pt)}),V.size===0){G(E);return}setTimeout(Mt,10)}te.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let vh=null;function i0(E){vh&&vh(E)}function Du(){hs.stop()}function Nu(){hs.start()}let hs=new om;hs.setAnimationLoop(i0),typeof self<"u"&&hs.setContext(self),this.setAnimationLoop=function(E){vh=E,Nt.setAnimationLoop(E),E===null?hs.stop():hs.start()},Nt.addEventListener("sessionstart",Du),Nt.addEventListener("sessionend",Nu),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){qt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;D!==null&&D.renderStart(E,k);let X=Nt.enabled===!0&&Nt.isPresenting===!0,V=A!==null&&(it===null||X)&&A.begin(R,it);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Nt.enabled===!0&&Nt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Nt.cameraAutoUpdate===!0&&Nt.updateCamera(k),k=Nt.getCamera()),E.isScene===!0&&E.onBeforeRender(R,E,k,it),T=pt.get(E,_.length),T.init(k),T.state.textureUnits=Z.getTextureUnits(),_.push(T),at.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),et.setFromProjectionMatrix(at,Jn,k.reversedDepth),ot=this.localClippingEnabled,rt=It.init(this.clippingPlanes,ot),S=mt.get(E,C.length),S.init(),C.push(S),Nt.enabled===!0&&Nt.isPresenting===!0){let Pt=R.xr.getDepthSensingMesh();Pt!==null&&_h(Pt,k,-1/0,R.sortObjects)}_h(E,k,0,R.sortObjects),S.finish(),D!==null&&D.updateLights(T.state.lightsArray),R.sortObjects===!0&&S.sort(ut,Ft),$t=Nt.enabled===!1||Nt.isPresenting===!1||Nt.hasDepthSensing()===!1,$t&&Zt.addToRenderList(S,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&It.beginShadows();let G=T.state.shadowsArray;if(Bt.render(G,E,k),rt===!0&&It.endShadows(),(V&&A.hasRenderPass())===!1){let Pt=S.opaque,_t=S.transmissive;if(T.setupLights(),k.isArrayCamera){let Lt=k.cameras;if(_t.length>0)for(let kt=0,ee=Lt.length;kt<ee;kt++){let re=Lt[kt];ku(Pt,_t,E,re)}$t&&Zt.render(E);for(let kt=0,ee=Lt.length;kt<ee;kt++){let re=Lt[kt];Uu(S,E,re,re.viewport)}}else _t.length>0&&ku(Pt,_t,E,k),$t&&Zt.render(E),Uu(S,E,k)}it!==null&&$===0&&(Z.updateMultisampleRenderTarget(it),Z.updateRenderTargetMipmap(it)),V&&A.end(R),E.isScene===!0&&E.onAfterRender(R,E,k),Et.resetDefaultState(),W=-1,j=null,_.pop(),_.length>0?(T=_[_.length-1],Z.setTextureUnits(T.state.textureUnits),rt===!0&&It.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?S=C[C.length-1]:S=null,D!==null&&D.renderEnd()};function _h(E,k,X,V){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLightProbeGrid)T.pushLightProbeGrid(E);else if(E.isLight)T.pushLight(E),E.castShadow&&T.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(et)){V&&Vt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(at);let Pt=nt.update(E),_t=E.material;_t.visible&&S.push(E,Pt,_t,X,Vt.z,null,k)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(et))){let Pt=nt.update(E),_t=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Vt.copy(E.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Vt.copy(Pt.boundingSphere.center)),Vt.applyMatrix4(E.matrixWorld).applyMatrix4(at)),Array.isArray(_t)){let Lt=Pt.groups;for(let kt=0,ee=Lt.length;kt<ee;kt++){let re=Lt[kt],Dt=_t[re.materialIndex];Dt&&Dt.visible&&S.push(E,Pt,Dt,X,Vt.z,re,k)}}else _t.visible&&S.push(E,Pt,_t,X,Vt.z,null,k)}}let Mt=E.children;for(let Pt=0,_t=Mt.length;Pt<_t;Pt++)_h(Mt[Pt],k,X,V)}function Uu(E,k,X,V){let{opaque:G,transmissive:Mt,transparent:Pt}=E;T.setupLightsView(X),rt===!0&&It.setGlobalState(R.clippingPlanes,X),V&&w.viewport(Q.copy(V)),G.length>0&&xa(G,k,X),Mt.length>0&&xa(Mt,k,X),Pt.length>0&&xa(Pt,k,X),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function ku(E,k,X,V){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){let Dt=te.has("EXT_color_buffer_half_float")||te.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new Ge(1,1,{generateMipmaps:!0,type:Dt?sn:pn,minFilter:ns,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:se.workingColorSpace})}let Mt=T.state.transmissionRenderTarget[V.id],Pt=V.viewport||Q;Mt.setSize(Pt.z*R.transmissionResolutionScale,Pt.w*R.transmissionResolutionScale);let _t=R.getRenderTarget(),Lt=R.getActiveCubeFace(),kt=R.getActiveMipmapLevel();R.setRenderTarget(Mt),R.getClearColor(he),Qt=R.getClearAlpha(),Qt<1&&R.setClearColor(16777215,.5),R.clear(),$t&&Zt.render(X);let ee=R.toneMapping;R.toneMapping=Qn;let re=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),rt===!0&&It.setGlobalState(R.clippingPlanes,V),xa(E,X,V),Z.updateMultisampleRenderTarget(Mt),Z.updateRenderTargetMipmap(Mt),te.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let ve=0,$e=k.length;ve<$e;ve++){let Le=k[ve],{object:Se,geometry:ln,material:Ct,group:yn}=Le;if(Ct.side===On&&Se.layers.test(V.layers)){let me=Ct.side;Ct.side=Je,Ct.needsUpdate=!0,Fu(Se,X,V,ln,Ct,yn),Ct.side=me,Ct.needsUpdate=!0,Dt=!0}}Dt===!0&&(Z.updateMultisampleRenderTarget(Mt),Z.updateRenderTargetMipmap(Mt))}R.setRenderTarget(_t,Lt,kt),R.setClearColor(he,Qt),re!==void 0&&(V.viewport=re),R.toneMapping=ee}function xa(E,k,X){let V=k.isScene===!0?k.overrideMaterial:null;for(let G=0,Mt=E.length;G<Mt;G++){let Pt=E[G],{object:_t,geometry:Lt,group:kt}=Pt,ee=Pt.material;ee.allowOverride===!0&&V!==null&&(ee=V),_t.layers.test(X.layers)&&Fu(_t,k,X,Lt,ee,kt)}}function Fu(E,k,X,V,G,Mt){D!==null&&G.isNodeMaterial&&D.setObject(E,G),E.onBeforeRender(R,k,X,V,G,Mt),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),G.onBeforeRender(R,k,X,V,E,Mt),G.transparent===!0&&G.side===On&&G.forceSinglePass===!1?(G.side=Je,G.needsUpdate=!0,R.renderBufferDirect(X,k,V,G,E,Mt),G.side=ts,G.needsUpdate=!0,R.renderBufferDirect(X,k,V,G,E,Mt),G.side=On):R.renderBufferDirect(X,k,V,G,E,Mt),E.onAfterRender(R,k,X,V,G,Mt)}function va(E,k,X){k.isScene!==!0&&(k=Ot);let V=H.get(E),G=T.state.lights,Mt=T.state.shadowsArray,Pt=G.state.version,_t=gt.getParameters(E,G.state,Mt,k,X,T.state.lightProbeGridArray),Lt=gt.getProgramCacheKey(_t),kt=V.programs;V.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?k.environment:null,V.fog=k.fog;let ee=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;V.envMap=ct.get(E.envMap||V.environment,ee),V.envMapRotation=V.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,kt===void 0&&(E.addEventListener("dispose",ii),kt=new Map,V.programs=kt);let re=kt.get(Lt);if(re!==void 0){if(V.currentProgram===re&&V.lightsStateVersion===Pt)return Bu(E,_t),re}else _t.uniforms=gt.getUniforms(E),D!==null&&E.isNodeMaterial&&D.build(E,X,_t),E.onBeforeCompile(_t,R),re=gt.acquireProgram(_t,Lt),kt.set(Lt,re),V.uniforms=_t.uniforms;let Dt=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Dt.clippingPlanes=It.uniform),Bu(E,_t),V.needsLights=a0(E),V.lightsStateVersion=Pt,V.needsLights&&(Dt.ambientLightColor.value=G.state.ambient,Dt.lightProbe.value=G.state.probe,Dt.sunLights.value=G.state.sun,Dt.sunLightShadows.value=G.state.sunShadow,Dt.directionalLights.value=G.state.directional,Dt.directionalLightShadows.value=G.state.directionalShadow,Dt.spotLights.value=G.state.spot,Dt.spotLightShadows.value=G.state.spotShadow,Dt.rectAreaLights.value=G.state.rectArea,Dt.ltc_1.value=G.state.rectAreaLTC1,Dt.ltc_2.value=G.state.rectAreaLTC2,Dt.pointLights.value=G.state.point,Dt.pointLightShadows.value=G.state.pointShadow,Dt.hemisphereLights.value=G.state.hemi,Dt.sunShadowMatrix.value=G.state.sunShadowMatrix,Dt.sunShadowCascade.value=G.state.sunShadowCascade,Dt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Dt.spotLightMatrix.value=G.state.spotLightMatrix,Dt.spotLightMap.value=G.state.spotLightMap,Dt.pointShadowMatrix.value=G.state.pointShadowMatrix),V.lightProbeGrid=T.state.lightProbeGridArray.length>0,V.currentProgram=re,V.uniformsList=null,re}function Ou(E){if(E.uniformsList===null){let k=E.currentProgram.getUniforms();E.uniformsList=Lr.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function Bu(E,k){let X=H.get(E);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.batchingColor=k.batchingColor,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}function s0(E,k){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;v.setFromMatrixPosition(k.matrixWorld);for(let X=0,V=E.length;X<V;X++){let G=E[X];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function r0(E,k,X,V,G){k.isScene!==!0&&(k=Ot),Z.resetTextureUnits();let Mt=k.fog,Pt=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?k.environment:null,_t=it===null?R.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:se.workingColorSpace,Lt=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,kt=ct.get(V.envMap||Pt,Lt),ee=V.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,re=!!X.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Dt=!!X.morphAttributes.position,ve=!!X.morphAttributes.normal,$e=!!X.morphAttributes.color,Le=Qn;V.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Le=R.toneMapping);let Se=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ln=Se!==void 0?Se.length:0,Ct=H.get(V),yn=T.state.lights;if(rt===!0&&(ot===!0||E!==j)){let Ce=E===j&&V.id===W;It.setState(V,E,Ce)}let me=!1;V.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==yn.state.version||Ct.outputColorSpace!==_t||G.isBatchedMesh&&Ct.batching===!1||!G.isBatchedMesh&&Ct.batching===!0||G.isBatchedMesh&&Ct.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Ct.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Ct.instancing===!1||!G.isInstancedMesh&&Ct.instancing===!0||G.isSkinnedMesh&&Ct.skinning===!1||!G.isSkinnedMesh&&Ct.skinning===!0||G.isInstancedMesh&&Ct.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ct.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ct.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ct.instancingMorph===!1&&G.morphTexture!==null||Ct.envMap!==kt||V.fog===!0&&Ct.fog!==Mt||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==It.numPlanes||Ct.numIntersection!==It.numIntersection)||Ct.vertexAlphas!==ee||Ct.vertexTangents!==re||Ct.morphTargets!==Dt||Ct.morphNormals!==ve||Ct.morphColors!==$e||Ct.toneMapping!==Le||Ct.morphTargetsCount!==ln||!!Ct.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(me=!0):(me=!0,Ct.__version=V.version);let Un=Ct.currentProgram;me===!0&&(Un=va(V,k,G),D&&V.isNodeMaterial&&D.onUpdateProgram(V,Un,Ct));let si=!1,Ni=!1,Bs=!1,Me=Un.getUniforms(),Be=Ct.uniforms;if(w.useProgram(Un.program)&&(si=!0,Ni=!0,Bs=!0),V.id!==W&&(W=V.id,Ni=!0),Ct.needsLights){let Ce=s0(T.state.lightProbeGridArray,G);Ct.lightProbeGrid!==Ce&&(Ct.lightProbeGrid=Ce,Ni=!0)}if(si||j!==E){w.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Me.setValue(U,"projectionMatrix",E.projectionMatrix),Me.setValue(U,"viewMatrix",E.matrixWorldInverse);let ki=Me.map.cameraPosition;ki!==void 0&&ki.setValue(U,dt.setFromMatrixPosition(E.matrixWorld)),P.logarithmicDepthBuffer&&Me.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Me.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),j!==E&&(j=E,Ni=!0,Bs=!0)}if(Ct.needsLights&&(yn.state.sunShadowMap.length>0&&Me.setValue(U,"sunShadowMap",yn.state.sunShadowMap,Z),yn.state.directionalShadowMap.length>0&&Me.setValue(U,"directionalShadowMap",yn.state.directionalShadowMap,Z),yn.state.spotShadowMap.length>0&&Me.setValue(U,"spotShadowMap",yn.state.spotShadowMap,Z),yn.state.pointShadowMap.length>0&&Me.setValue(U,"pointShadowMap",yn.state.pointShadowMap,Z)),G.isSkinnedMesh){Me.setOptional(U,G,"bindMatrix"),Me.setOptional(U,G,"bindMatrixInverse");let Ce=G.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),Me.setValue(U,"boneTexture",Ce.boneTexture,Z))}G.isBatchedMesh&&(Me.setOptional(U,G,"batchingTexture"),Me.setValue(U,"batchingTexture",G._matricesTexture,Z),Me.setOptional(U,G,"batchingIdTexture"),Me.setValue(U,"batchingIdTexture",G._indirectTexture,Z),Me.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&Me.setValue(U,"batchingColorTexture",G._colorsTexture,Z));let Ui=X.morphAttributes;if((Ui.position!==void 0||Ui.normal!==void 0||Ui.color!==void 0)&&F.update(G,X,Un),(Ni||Ct.receiveShadow!==G.receiveShadow)&&(Ct.receiveShadow=G.receiveShadow,Me.setValue(U,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&k.environment!==null&&(Be.envMapIntensity.value=k.environmentIntensity),Be.dfgLUT!==void 0&&(Be.dfgLUT.value=L1()),Ni){if(Me.setValue(U,"toneMappingExposure",R.toneMappingExposure),Ct.needsLights&&o0(Be,Bs),Mt&&V.fog===!0&&Ut.refreshFogUniforms(Be,Mt),Ut.refreshMaterialUniforms(Be,V,J,Y,T.state.transmissionRenderTarget[E.id]),Ct.needsLights&&Ct.lightProbeGrid){let Ce=Ct.lightProbeGrid;Be.probesSH.value=Ce.texture,Be.probesMin.value.copy(Ce.boundingBox.min),Be.probesMax.value.copy(Ce.boundingBox.max),Be.probesResolution.value.copy(Ce.resolution)}Lr.upload(U,Ou(Ct),Be,Z)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Lr.upload(U,Ou(Ct),Be,Z),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Me.setValue(U,"center",G.center),Me.setValue(U,"modelViewMatrix",G.modelViewMatrix),Me.setValue(U,"normalMatrix",G.normalMatrix),Me.setValue(U,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){let Ce=V.uniformsGroups;for(let ki=0,zs=Ce.length;ki<zs;ki++){let Hu=Ce[ki];st.update(Hu,Un),st.bind(Hu,Un)}}return Un}function o0(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.sunLights.needsUpdate=k,E.sunLightShadows.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function a0(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(E,k,X){let V=H.get(E);V.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),H.get(E.texture).__webglTexture=k,H.get(E.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:X,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,k){let X=H.get(E);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,X=0){it=E,q=k,$=X;let V=null,G=!1,Mt=!1;if(E){let _t=H.get(E);if(_t.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(U.FRAMEBUFFER,_t.__webglFramebuffer),Q.copy(E.viewport),Rt.copy(E.scissor),At=E.scissorTest,w.viewport(Q),w.scissor(Rt),w.setScissorTest(At),W=-1;return}else if(_t.__webglFramebuffer===void 0)Z.setupRenderTarget(E);else if(_t.__hasExternalTextures)Z.rebindTextures(E,H.get(E.texture).__webglTexture,H.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let ee=E.depthTexture;if(_t.__boundDepthTexture!==ee){if(ee!==null&&H.has(ee)&&(E.width!==ee.image.width||E.height!==ee.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(E)}}let Lt=E.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(Mt=!0);let kt=H.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(kt[k])?V=kt[k][X]:V=kt[k],G=!0):E.samples>0&&Z.useMultisampledRTT(E)===!1?V=H.get(E).__webglMultisampledFramebuffer:Array.isArray(kt)?V=kt[X]:V=kt,Q.copy(E.viewport),Rt.copy(E.scissor),At=E.scissorTest}else Q.copy(Tt).multiplyScalar(J).floor(),Rt.copy(Wt).multiplyScalar(J).floor(),At=pe;if(X!==0&&(V=O),w.bindFramebuffer(U.FRAMEBUFFER,V)&&w.drawBuffers(E,V),w.viewport(Q),w.scissor(Rt),w.setScissorTest(At),G){let _t=H.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,_t.__webglTexture,X)}else if(Mt){let _t=k;for(let Lt=0;Lt<E.textures.length;Lt++){let kt=H.get(E.textures[Lt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Lt,kt.__webglTexture,X,_t)}}else if(E!==null&&X!==0){let _t=H.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,_t.__webglTexture,X)}W=-1};function zu(E){let k=H.get(E);return(k.__readFormat!==E.format||k.__readType!==E.type)&&(k.__readFormat=E.format,k.__readType=E.type,k.__formatReadable=P.textureFormatReadable(E.format),k.__typeReadable=P.textureTypeReadable(E.type)),k}this.readRenderTargetPixels=function(E,k,X,V,G,Mt,Pt,_t=0){if(!(E&&E.isWebGLRenderTarget)){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=H.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt){w.bindFramebuffer(U.FRAMEBUFFER,Lt);try{let kt=E.textures[_t],ee=kt.format,re=kt.type;E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+_t);let Dt=zu(kt);if(Dt.__formatReadable===!1){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Dt.__typeReadable===!1){qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-V&&X>=0&&X<=E.height-G&&U.readPixels(k,X,V,G,xt.convert(ee),xt.convert(re),Mt)}finally{let kt=it!==null?H.get(it).__webglFramebuffer:null;w.bindFramebuffer(U.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(E,k,X,V,G,Mt,Pt,_t=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=H.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Pt!==void 0&&(Lt=Lt[Pt]),Lt)if(k>=0&&k<=E.width-V&&X>=0&&X<=E.height-G){w.bindFramebuffer(U.FRAMEBUFFER,Lt);let kt=E.textures[_t],ee=kt.format,re=kt.type;E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+_t);let Dt=zu(kt);if(Dt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Dt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ve=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,ve),U.bufferData(U.PIXEL_PACK_BUFFER,Mt.byteLength,U.STREAM_READ),U.readPixels(k,X,V,G,xt.convert(ee),xt.convert(re),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let $e=it!==null?H.get(it).__webglFramebuffer:null;w.bindFramebuffer(U.FRAMEBUFFER,$e);let Le=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Pp(U,Le,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,ve),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Mt),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(ve),U.deleteSync(Le),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,k=null,X=0){let V=Math.pow(2,-X),G=Math.floor(E.image.width*V),Mt=Math.floor(E.image.height*V),Pt=k!==null?k.x:0,_t=k!==null?k.y:0;Z.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,Pt,_t,G,Mt),w.unbindTexture()},this.copyTextureToTexture=function(E,k,X=null,V=null,G=0,Mt=0){let Pt,_t,Lt,kt,ee,re,Dt,ve,$e,Le=E.isCompressedTexture?E.mipmaps[Mt]:E.image;if(X!==null)Pt=X.max.x-X.min.x,_t=X.max.y-X.min.y,Lt=X.isBox3?X.max.z-X.min.z:1,kt=X.min.x,ee=X.min.y,re=X.isBox3?X.min.z:0;else{let Be=Math.pow(2,-G);Pt=Math.floor(Le.width*Be),_t=Math.floor(Le.height*Be),E.isDataArrayTexture?Lt=Le.depth:E.isData3DTexture?Lt=Math.floor(Le.depth*Be):Lt=1,kt=0,ee=0,re=0}V!==null?(Dt=V.x,ve=V.y,$e=V.z):(Dt=0,ve=0,$e=0);let Se=xt.convert(k.format),ln=xt.convert(k.type),Ct;k.isData3DTexture?(Z.setTexture3D(k,0),Ct=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Z.setTexture2DArray(k,0),Ct=U.TEXTURE_2D_ARRAY):(Z.setTexture2D(k,0),Ct=U.TEXTURE_2D),w.activeTexture(U.TEXTURE0),w.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),w.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),w.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);let yn=w.getParameter(U.UNPACK_ROW_LENGTH),me=w.getParameter(U.UNPACK_IMAGE_HEIGHT),Un=w.getParameter(U.UNPACK_SKIP_PIXELS),si=w.getParameter(U.UNPACK_SKIP_ROWS),Ni=w.getParameter(U.UNPACK_SKIP_IMAGES);w.pixelStorei(U.UNPACK_ROW_LENGTH,Le.width),w.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Le.height),w.pixelStorei(U.UNPACK_SKIP_PIXELS,kt),w.pixelStorei(U.UNPACK_SKIP_ROWS,ee),w.pixelStorei(U.UNPACK_SKIP_IMAGES,re);let Bs=E.isDataArrayTexture||E.isData3DTexture,Me=k.isDataArrayTexture||k.isData3DTexture;if(E.isDepthTexture){let Be=H.get(E),Ui=H.get(k),Ce=H.get(Be.__renderTarget),ki=H.get(Ui.__renderTarget);w.bindFramebuffer(U.READ_FRAMEBUFFER,Ce.__webglFramebuffer),w.bindFramebuffer(U.DRAW_FRAMEBUFFER,ki.__webglFramebuffer);for(let zs=0;zs<Lt;zs++)Bs&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(E).__webglTexture,G,re+zs),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(k).__webglTexture,Mt,$e+zs)),U.blitFramebuffer(kt,ee,Pt,_t,Dt,ve,Pt,_t,U.DEPTH_BUFFER_BIT,U.NEAREST);w.bindFramebuffer(U.READ_FRAMEBUFFER,null),w.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||E.isRenderTargetTexture||H.has(E)){let Be=H.get(E),Ui=H.get(k);w.bindFramebuffer(U.READ_FRAMEBUFFER,N),w.bindFramebuffer(U.DRAW_FRAMEBUFFER,z);for(let Ce=0;Ce<Lt;Ce++)Bs?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Be.__webglTexture,G,re+Ce):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Be.__webglTexture,G),Me?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ui.__webglTexture,Mt,$e+Ce):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ui.__webglTexture,Mt),G!==0?U.blitFramebuffer(kt,ee,Pt,_t,Dt,ve,Pt,_t,U.COLOR_BUFFER_BIT,U.NEAREST):Me?U.copyTexSubImage3D(Ct,Mt,Dt,ve,$e+Ce,kt,ee,Pt,_t):U.copyTexSubImage2D(Ct,Mt,Dt,ve,kt,ee,Pt,_t);w.bindFramebuffer(U.READ_FRAMEBUFFER,null),w.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Me?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Ct,Mt,Dt,ve,$e,Pt,_t,Lt,Se,ln,Le.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Ct,Mt,Dt,ve,$e,Pt,_t,Lt,Se,Le.data):U.texSubImage3D(Ct,Mt,Dt,ve,$e,Pt,_t,Lt,Se,ln,Le):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Mt,Dt,ve,Pt,_t,Se,ln,Le.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Mt,Dt,ve,Le.width,Le.height,Se,Le.data):U.texSubImage2D(U.TEXTURE_2D,Mt,Dt,ve,Pt,_t,Se,ln,Le);w.pixelStorei(U.UNPACK_ROW_LENGTH,yn),w.pixelStorei(U.UNPACK_IMAGE_HEIGHT,me),w.pixelStorei(U.UNPACK_SKIP_PIXELS,Un),w.pixelStorei(U.UNPACK_SKIP_ROWS,si),w.pixelStorei(U.UNPACK_SKIP_IMAGES,Ni),Mt===0&&k.generateMipmaps&&U.generateMipmap(Ct),w.unbindTexture()},this.initRenderTarget=function(E){H.get(E).__webglFramebuffer===void 0&&Z.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Z.setTextureCube(E,0):E.isData3DTexture?Z.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Z.setTexture2DArray(E,0):Z.setTexture2D(E,0),w.unbindTexture()},this.resetState=function(){q=0,$=0,it=null,w.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}};var bm=new Cs({vertexColors:!0}),xu=new As({vertexColors:!0,roughness:.82,metalness:0});xu.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
attribute float metal;
varying float vMetal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMetal = metal;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
varying float vMetal;`).replace("#include <roughnessmap_fragment>","float roughnessFactor = mix( roughness, 0.3, vMetal );").replace("#include <metalnessmap_fragment>","float metalnessFactor = mix( metalness, 0.92, vMetal );")};xu.customProgramCacheKey=()=>"metalAttr";var vu=bm;function Sm(s){vu=s?xu:bm}function Tm(){return vu}var Ee="#9aa3ab",_n="#5d646b",$c="#c8d0d8",mi="#b08a3a",Us="#7a5230",fu="#4a3020",la="#6b4526",Hn="#3a2616",fm=["#e0b590","#d4a57f","#c68c62","#e8c3a0","#b77a50"],pm=["#2b1d12","#5a3a1e","#8a6a3a","#1a1a1a","#b08a50"],D1={[Ee]:1,[_n]:.9,[$c]:1,[mi]:.85,"#8a9096":.9,"#8d949b":.6,"#6d6f72":.55,"#7f8487":.7,"#b4bcc4":1};function Em(s){return fm[Math.floor(s()*fm.length)]}function Am(s){return pm[Math.floor(s()*pm.length)]}function pu(s,t){return`#${new St(s).multiplyScalar(t).getHexString()}`}var mm=new ce,aa=new an,N1=new Fn,U1=new L,k1=new L,F1=new L(0,1,0),mu=new L,Wc=new L,gn=class{constructor(){this.pos=[],this.nrm=[],this.col=[],this.met=[]}add(t,e,n=[0,0,0],i=[0,0,0],r=[1,1,1]){let o=t.index?t.toNonIndexed():t;i.isQuaternion?aa.copy(i):aa.setFromEuler(N1.set(i[0],i[1],i[2])),mm.compose(U1.set(n[0],n[1],n[2]),aa,k1.set(r[0],r[1],r[2])),o.applyMatrix4(mm);let a=new St(e),l=D1[e]||0,c=o.attributes.position.array,h=o.attributes.normal.array;for(let d=0;d<c.length;d+=3)this.pos.push(c[d],c[d+1],c[d+2]),this.nrm.push(h[d],h[d+1],h[d+2]),this.col.push(a.r,a.g,a.b),this.met.push(l);return this}box(t,e,n,i,r,o,a){return this.add(new nn(t,e,n),i,r,o,a)}cyl(t,e,n,i,r,o,a,l){return this.add(new Ci(t,e,n,i),r,o,a,l)}sphere(t,e,n,i=8,r=6,o,a){return this.add(new Pi(t,i,r),e,n,a||[0,0,0],o)}cone(t,e,n,i,r,o,a){return this.add(new Ri(t,e,n),i,r,o,a)}limb(t,e,n,i,r,o,a=[1,1]){mu.set(e[0]-t[0],e[1]-t[1],e[2]-t[2]);let l=mu.length();return aa.setFromUnitVectors(F1,mu.normalize()),Wc.set((t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2),this.add(new Ci(i,n,l,r,1),o,[Wc.x,Wc.y,Wc.z],aa.clone(),[a[0],1,a[1]])}wrapZ(t,e,n,i,r,o,a=[1,1,1],l=t){let c=new Ci(l,t,e,i,1,!0,Math.PI-n/2,n);return this.add(c,r,o,[Math.PI/2,0,0],a)}wrapY(t,e,n,i,r,o,a,l=[1,1,1],c=!1){let h=new Ci(t,e,n,r,1,!0,(c?Math.PI:0)-i/2,i);return this.add(h,o,a,[0,0,0],l)}build(){let t=new be;return t.setAttribute("position",new Kt(this.pos,3)),t.setAttribute("normal",new Kt(this.nrm,3)),t.setAttribute("color",new Kt(this.col,3)),t.setAttribute("metal",new Kt(this.met,1)),t.computeBoundingSphere(),t}},gm=new Map;function Li(s,t){let e=gm.get(s);return e||(e=t(),gm.set(s,e)),e}function Dn(s){let t=new ge(s,vu);return t.castShadow=!0,t.receiveShadow=!0,t}var Cm={cloth:null,padded:"#cdbf9a",leather:"#7a5534",mail:"#8d949b",lamellar:"#7f8487",plate:"#b4bcc4"},gu=.62;function O1(s,t,e){return Li(`torso:${s}:${t}:${e}`,()=>{let n=new gn,i=Cm[s]||t,r=[1,1,gu];n.cyl(.215,.18,.34,14,i,[0,.43,0],[0,0,0],r),n.cyl(.18,.185,.26,14,i,[0,.15,0],[0,0,0],r),n.sphere(.215,i,[0,.58,0],14,6,[1,.32,gu]),n.cyl(.192,.192,.06,14,la,[0,.03,0],[0,0,0],[1,1,gu+.03]),n.box(.06,.05,.02,mi,[0,.03,.125]);let o=s==="plate"?_n:s==="cloth"?t:s==="leather"?"#6a4a2e":i;if(n.cyl(.19,.235,.3,14,o,[0,-.12,0],[0,0,0],[1,1,.7]),s==="mail"||s==="plate"||s==="lamellar"||s==="padded"?(n.wrapY(.222,.19,.54,1.5,8,t,[0,.33,0],r),n.wrapY(.222,.19,.54,1.5,8,t,[0,.33,0],r,!0),n.wrapY(.19,.245,.29,1.4,8,t,[0,-.135,0],[1,1,.72]),n.wrapY(.19,.245,.29,1.4,8,t,[0,-.135,0],[1,1,.72],!0),n.box(.07,.3,.02,e,[0,.38,.14]),n.box(.2,.06,.02,e,[0,.44,.137])):s==="leather"?(n.wrapY(.222,.19,.34,.5,4,t,[0,.4,0],r),n.box(.06,.08,.02,mi,[.08,.3,.12])):(n.cyl(.13,.19,.05,14,e,[0,.61,0],[0,0,0],r),n.cyl(.236,.24,.04,14,e,[0,-.26,0],[0,0,0],[1,1,.7])),s==="plate"||s==="lamellar"){for(let a of[.25,-.25])n.sphere(.12,Ee,[a,.56,0],10,6,[1,.62,1.05]);n.cyl(.12,.2,.06,12,Ee,[0,.62,0],[0,0,0],r)}else s==="mail"&&n.cyl(.1,.19,.08,12,"#8d949b",[0,.63,0],[0,0,0],r);return n.build()})}function B1(s,t,e){return Li(`head:${s}:${t}:${e}`,()=>{let n=new gn;n.cyl(.056,.06,.12,8,s,[0,.04,0]),n.sphere(.118,s,[0,.185,0],12,8,[.92,1.08,1]),n.sphere(.09,s,[0,.125,.03],10,6,[.95,.85,1]),n.limb([0,.2,.103],[0,.158,.122],.011,.016,6,s,[1,1.2]),n.sphere(.017,s,[0,.157,.12],6,4,[1.15,.9,1]);for(let i of[.042,-.042])n.sphere(.015,"#e9e2d4",[i,.194,.1],6,4,[1.15,.62,.6]),n.sphere(.0075,"#24160c",[i,.194,.108],5,3,[1,1,.6]),n.box(.045,.012,.02,t,[i,.222,.103],[.1,0,i>0?-.12:.12]),n.sphere(.028,s,[i*2.7,.18,-.005],5,4,[.5,1,.8]);return n.box(.05,.01,.01,"#8a4a3a",[0,.105,.117]),n.add(new Pi(.127,12,6,0,Math.PI*2,0,Math.PI*.58),t,[0,.19,-.008],[-.7,0,0],[.95,1.06,1.02]),e&&(n.sphere(.093,t,[0,.115,.035],8,5,[.97,.9,1]),n.box(.07,.016,.02,t,[0,.13,.128]),n.box(.045,.01,.01,"#8a4a3a",[0,.112,.13])),n.build()})}function z1(s,t){return s?Li(`helm:${s}:${t}`,()=>{let e=new gn,n=(i,r,o,a,l,c=0)=>e.add(new Pi(i,16,8,0,Math.PI*2,0,Math.PI*a),r,o,[c,0,0],l);switch(s){case"hood":n(.142,t,[0,.19,-.01],.62,[1,1.08,1.08],-.55),e.cyl(.11,.24,.14,14,t,[0,0,-.01],[0,0,0],[1,1,.78]);break;case"fur":e.cyl(.14,.145,.12,14,"#6b4a2e",[0,.3,0]),n(.135,"#8a6a4a",[0,.34,0],.5,[1,.7,1]);break;case"cap":n(.135,la,[0,.2,0],.5,[1,1.05,1.05]),e.cyl(.137,.137,.025,14,Hn,[0,.21,0]);break;case"nasal":e.cone(.136,.2,14,Ee,[0,.36,0]),e.cyl(.136,.136,.08,14,Ee,[0,.23,0]),e.box(.025,.12,.02,Ee,[0,.17,.132]);break;case"spangen":n(.138,Ee,[0,.21,0],.5,[1,1.12,1.05]),e.add(new Es(.139,.009,4,18,Math.PI),mi,[0,.21,0],[0,0,0],[1,1.12,1]),e.add(new Es(.139,.009,4,18,Math.PI),mi,[0,.21,0],[0,Math.PI/2,0],[1,1.12,1]),e.cyl(.14,.14,.04,14,mi,[0,.21,0]),e.box(.24,.07,.03,Ee,[0,.18,.12]);break;case"kettle":n(.135,Ee,[0,.22,0],.5,[1,.95,1]),e.cyl(.215,.225,.018,20,Ee,[0,.22,0]),e.cyl(.02,.02,.02,6,Ee,[0,.35,0]);break;case"spiked":e.cone(.137,.32,14,Ee,[0,.4,0]),e.cyl(.14,.14,.07,14,"#8a6a3a",[0,.22,0]),e.cyl(.02,.005,.1,6,t,[0,.6,0]),e.box(.22,.14,.02,"#6d6f72",[0,.1,-.1]);break;case"great":e.cyl(.142,.15,.33,16,Ee,[0,.19,0]),n(.142,Ee,[0,.35,0],.5,[1,.45,1]),e.box(.19,.018,.02,"#111111",[0,.2,.146]),e.box(.018,.13,.02,mi,[0,.13,.148]);for(let i=0;i<3;i++)e.box(.012,.012,.02,"#111111",[.04+i*.02,.1,.143]);break;default:return null}return e.build()}):null}function ym(s,t){return Li(`leg:${s}:${t}`,()=>{let e=new gn;return e.sphere(.092,s,[0,-.02,0],8,5,[1,1,1.05]),e.limb([0,-.02,0],[0,-.45,.01],.09,.066,8,s,[1,1.1]),e.sphere(.066,s,[0,-.46,.012],6,4),e.limb([0,-.46,.01],[0,-.8,-.01],.064,.05,8,s),e.limb([0,-.56,-.005],[0,-.87,-.005],.07,.066,8,t),e.cyl(.075,.075,.03,8,t,[0,-.56,-.005]),e.sphere(.07,t,[0,-.875,.06],8,5,[.95,.65,1.9]),e.box(.13,.025,.27,"#241810",[0,-.908,.05]),e.build()})}function xm(s,t,e){return Li(`arm:${s}:${t}:${e}`,()=>{let n=new gn,i=e?_n:s,r=e?"#4a3a2a":t;return n.sphere(.078,s,[0,-.02,0],8,5),n.limb([0,-.02,0],[0,-.34,0],.072,.058,8,s),n.sphere(.057,s,[0,-.34,0],6,4),n.limb([0,-.34,0],[0,-.55,0],.056,.044,8,e?s:t),e?n.limb([0,-.47,0],[0,-.56,0],.06,.056,8,i):n.cyl(.058,.058,.04,8,s,[0,-.36,0]),n.sphere(.048,r,[0,-.6,.008],8,5,[.8,1.15,1.05]),n.sphere(.02,r,[.03,-.585,.035],6,4,[1,1.5,1]),n.build()})}function Rm(s){let t=new Pe,e=new Pe;e.position.y=.92,t.add(e);let n=s.look==="plate"?_n:s.look==="mail"?"#6d6f72":s.pants,i=s.look==="plate"?Ee:Hn,r=new Pe,o=new Pe;r.position.set(.1,0,0),o.position.set(-.1,0,0),r.add(Dn(ym(n,i))),o.add(Dn(ym(n,i))),e.add(r,o);let a=new Pe;e.add(a),a.add(Dn(O1(s.look,s.team,s.team2)));let l=new Pe;l.position.y=.6,a.add(l),l.add(Dn(B1(s.skin,s.hair,!!s.beard)));let c=z1(s.helmet,s.team);c&&l.add(Dn(c));let h=Cm[s.look]||s.team,d=s.look==="mail"||s.look==="plate"||s.look==="lamellar",u=new Pe;u.position.set(-.28,.53,0),u.add(Dn(xm(h,s.skin,d)));let f=new Pe;f.position.y=-.6,u.add(f);let p=new Pe;f.add(p);let g=new Pe;g.position.set(.28,.53,0),g.add(Dn(xm(h,s.skin,d)));let m=new Pe;m.position.y=-.6,g.add(m),a.add(u,g);let y=new Pe;a.add(y);let x=new Pe;return x.position.set(0,.35,-.16),a.add(x),{root:t,hips:e,torso:a,neck:l,legL:r,legR:o,armR:u,armL:g,handR:f,wristR:p,handL:m,shieldMount:y,backMount:x}}var rn=[Math.PI/2,0,0];function H1(s,t,e,n,i=Ee){let r=e-n*1.4,o=[1,1,.3];s.cyl(n*.42,n/2,r,4,i,[0,0,t+r/2],rn,o),s.box(n*.22,.016,r*.9,$c,[0,0,t+r*.47]),s.cone(n*.42,n*1.4,4,i,[0,0,t+r+n*.7],rn,o)}function Ur(s){return Li(`w:${s}`,()=>{let t=new gn;switch(s){case"sword":case"sword_long":case"greatsword":{let e=s==="sword"?.72:s==="sword_long"?.85:1.1,n=s==="greatsword"?.26:.14;t.cyl(.018,.02,n,8,Hn,[0,0,-n/2+.04],rn),t.sphere(.03,mi,[0,0,-n+.02],8,6,[1,1,.8]),t.box(s==="greatsword"?.26:.18,.03,.03,mi,[0,0,.06]),H1(t,.075,e,s==="greatsword"?.055:.048);break}case"sabre":t.cyl(.018,.02,.14,8,Hn,[0,0,-.03],rn),t.box(.12,.028,.028,mi,[0,0,.05]),t.box(.04,.012,.45,Ee,[0,0,.3]),t.box(.04,.012,.36,Ee,[0,.04,.7],[-.22,0,0]),t.cone(.02,.08,4,Ee,[0,.088,.915],[Math.PI/2-.22,0,0],[1,1,.3]);break;case"cleaver":t.cyl(.018,.02,.14,8,fu,[0,0,-.03],rn),t.box(.08,.015,.4,"#8a9096",[0,.02,.26]);break;case"club":t.cyl(.028,.03,.3,8,fu,[0,0,.05],rn),t.cyl(.065,.035,.4,9,Us,[0,0,.4],rn),t.sphere(.065,Us,[0,0,.6],9,5,[1,1,.6]);break;case"mace":t.cyl(.022,.024,.55,8,fu,[0,0,.2],rn),t.sphere(.065,_n,[0,0,.52],10,8);for(let e of[0,1,2,3])t.box(.018,.15,.08,_n,[0,0,.52],[0,0,e*Math.PI/4]);break;case"axe":case"axe_war":case"throwaxe":{let e=s==="axe_war"?.75:s==="throwaxe"?.45:.62;t.cyl(.022,.025,e,8,Us,[0,0,e/2-.08],rn),t.box(.03,.06,.07,_n,[0,.01,e-.14]),t.box(.018,.18,.08,Ee,[0,.1,e-.14],[.12,0,0]),t.box(.02,.24,.035,$c,[0,.15,e-.105],[.05,0,0]);break}case"greataxe":t.cyl(.026,.03,1.25,8,Us,[0,0,.45],rn),t.box(.035,.08,.1,_n,[0,.01,.96]),t.box(.022,.32,.14,Ee,[0,.15,.96],[.1,0,0]),t.box(.024,.42,.045,$c,[0,.2,1.03],[.05,0,0]);break;case"spear":case"pitchfork":case"javelin":{let e=s==="javelin"?1.2:s==="pitchfork"?1.6:1.95,n=s==="javelin"?.4:.55;if(t.cyl(.02,.022,e,8,Us,[0,0,e/2-n],rn),s==="pitchfork"){for(let i of[-.06,0,.06])t.cyl(.006,.01,.22,5,_n,[i,0,e-n+.1],rn);t.box(.14,.02,.02,_n,[0,0,e-n])}else t.cyl(.022,.026,.08,8,_n,[0,0,e-n-.02],rn),t.cone(.04,.26,4,Ee,[0,0,e-n+.14],rn,[1,1,.35]);break}case"lance":t.cyl(.028,.04,2.9,10,"#a07a4a",[0,0,.55],rn),t.cyl(.075,.03,.16,10,"#8a6a3a",[0,0,.02],rn),t.cone(.035,.24,6,Ee,[0,0,2.1],rn);break;case"bow":case"bow_short":case"bow_long":{let e=s==="bow_long"?.8:s==="bow_short"?.5:.62,n=s==="bow_short"?"#6b3a1a":Us;t.cyl(.02,.02,.16,8,Hn,[0,0,0],rn);for(let i of[1,-1])t.limb([0,0,.06*i],[0,-.035,(e*.55+.06)*i],.02,.016,6,n),t.limb([0,-.035,(e*.55+.06)*i],[0,-.13,(e+.06)*i],.016,.01,6,n);t.box(.004,.004,e*2+.12,"#dddddd",[0,-.13,0]);break}case"crossbow":t.box(.055,.06,.72,Us,[0,0,.18]),t.limb([0,.02,.5],[.32,.02,.44],.022,.012,6,_n),t.limb([0,.02,.5],[-.32,.02,.44],.022,.012,6,_n),t.box(.64,.004,.004,"#dddddd",[0,.02,.44]),t.box(.02,.02,.35,"#dddddd",[0,.04,.4]);break;default:t.box(.04,.04,.8,Ee,[0,0,.4])}return t.build()})}function _u(s){let t=new Mr;return s(t),t}var V1=_u(s=>{s.moveTo(-.25,.31),s.lineTo(.25,.31),s.lineTo(.25,.06),s.quadraticCurveTo(.23,-.24,0,-.4),s.quadraticCurveTo(-.23,-.24,-.25,.06),s.closePath()}),G1=_u(s=>{s.moveTo(0,.49),s.quadraticCurveTo(.23,.48,.23,.28),s.lineTo(.22,.05),s.quadraticCurveTo(.17,-.36,0,-.62),s.quadraticCurveTo(-.17,-.36,-.22,.05),s.lineTo(-.23,.28),s.quadraticCurveTo(-.23,.48,0,.49)}),W1=_u(s=>{s.moveTo(-.29+.05,.43),s.lineTo(.29-.05,.43),s.quadraticCurveTo(.29,.43,.29,.43-.05),s.lineTo(.29*.94,-.63),s.lineTo(-.29*.94,-.63),s.lineTo(-.29,.43-.05),s.quadraticCurveTo(-.29,.43,-.29+.05,.43)});function yu(s,t,e,n,i=.02){let r={depth:i,bevelEnabled:!0,bevelThickness:.006,bevelSize:.01,bevelSegments:1,curveSegments:10};s.add(new br(t,r),e,[0,0,-i/2]),s.add(new br(t,{...r,depth:i*.6}),n,[0,0,-i/2-.004],[0,0,0],[1.035,1.03,1])}function Pm(s,t,e){return Li(`sh:${s}:${t}:${e}`,()=>{let n=new gn,i=[Math.PI/2,0,0];switch(s){case"round":{n.cyl(.32,.32,.035,24,t,[0,0,0],i),n.cyl(.3,.3,.04,24,e,[0,0,.002],i,[.55,1,.55]),n.add(new Es(.318,.014,5,28),Hn,[0,0,0]),n.sphere(.07,Ee,[0,0,.02],12,6,[1,1,.6]);break}case"kite":yu(n,G1,e,Hn),n.box(.05,.86,.012,t,[0,-.06,.024]),n.box(.36,.05,.012,t,[0,.2,.024]),n.sphere(.05,Ee,[0,.2,.026],10,5,[1,1,.5]);break;case"heater":yu(n,V1,e,Hn),n.box(.44,.06,.012,t,[0,.12,.024]),n.box(.06,.38,.012,t,[0,-.08,.024]);break;case"pavise":yu(n,W1,t,_n,.035),n.box(.2,.98,.03,e,[0,-.1,.025]);break;default:n.box(.5,.6,.04,t,[0,0,0])}return n.build()})}var vm=[0,1.42,.68],_m=[0,2.02,1.12],$1=[0,2.07,1.16],X1=[0,1.9,1.58];function q1(s,t,e){return Li(`horse:${s}:${t}:${e}`,()=>{let n=new gn,i=pu(s,.35),r=pu(s,.55);n.add(new To(.3,.95,6,14),s,[0,1.3,-.02],[Math.PI/2,0,0],[.95,1,1]),n.sphere(.31,s,[0,1.32,.6],14,10,[.95,1.05,.9]),n.sphere(.33,s,[0,1.38,-.56],14,10,[1,.98,1]),n.sphere(.2,s,[0,1.5,.5],12,8,[.9,.7,1.2]),n.limb(vm,_m,.26,.14,12,s,[.72,1.05]),n.limb([0,1.62,.52],[0,2.17,1.02],.05,.035,6,i,[.9,1.6]),n.sphere(.05,i,[0,2.17,1.1],6,4,[.8,1.2,1.4]),n.sphere(.13,s,[0,2.06,1.16],12,8,[.72,1,1.05]),n.limb($1,X1,.12,.08,12,s,[.7,1]),n.sphere(.085,r,[0,1.895,1.585],10,8,[.78,.95,1.05]);for(let a of[.055,-.055])n.cone(.03,.12,6,s,[a,2.2,1.11],[-.2,0,a>0?-.25:.25]),n.sphere(.022,"#120d0a",[a*1.45,2.06,1.25],6,4),n.sphere(.018,"#120d0a",[a*.6,1.87,1.66],5,4);n.limb([0,1.48,-.84],[0,1.3,-.96],.06,.05,6,i),n.limb([0,1.32,-.95],[0,.72,-1.02],.07,.1,8,i,[.8,1]),n.limb([.075,1.99,1.4],[.13,1.72,.32],.008,.008,4,Hn),n.limb([-.075,1.99,1.4],[-.13,1.72,.32],.008,.008,4,Hn),n.limb([0,1.975,1.39],[0,1.96,1.43],.1,.1,12,Hn,[.74,1.02]);let o=e?.39:.335;e||n.wrapZ(.325,.62,3.6,16,t,[0,1.3,.04],[.97,1,1]),n.wrapZ(o,.46,1.5,10,la,[0,1.3,.02],[.97,1,1]),n.sphere(.1,la,[0,1.33+o,.28],10,6,[1.35,.9,.6]),n.sphere(.12,la,[0,1.33+o,-.2],10,6,[1.35,.9,.5]);for(let a of[.31,-.31])n.limb([a*.98,1.55,.06],[a*1.05,1.05,.06],.01,.01,4,Hn),n.box(.1,.025,.06,_n,[a*1.05,1.03,.06]);return e&&(n.wrapZ(.36,1.72,3.2,20,t,[0,1.3,-.02],[1,1.05,1]),n.wrapY(.36,.41,.58,Math.PI*2,28,t,[0,1.02,-.02],[1,1,2.45]),n.wrapY(.412,.412,.05,Math.PI*2,28,pu(t,.55),[0,.76,-.02],[1,1,2.45]),n.limb(vm,_m,.285,.165,12,t,[.76,1.08]),n.limb([0,2.12,1.12],[0,1.95,1.52],.075,.06,8,Ee,[1.25,.65])),n.build()})}function Y1(s,t){return Li(`hleg:${s}:${t}`,()=>{let e=new gn,n="#1f1812";t?(e.sphere(.15,s,[0,0,-.02],10,8,[.8,1.6,1.15]),e.limb([0,.05,-.02],[0,-.48,-.1],.12,.07,10,s,[.8,1.1]),e.sphere(.066,s,[0,-.48,-.1],8,6,[.8,1,1.1]),e.limb([0,-.48,-.1],[0,-.9,-.05],.05,.045,8,s,[.85,1.1])):(e.sphere(.12,s,[0,-.05,.03],10,8,[.8,1.7,1.1]),e.limb([0,.05,.02],[0,-.5,0],.1,.06,10,s,[.8,1.1]),e.sphere(.06,s,[0,-.5,0],8,6,[.8,1,1.05]),e.limb([0,-.5,0],[0,-.9,-.01],.047,.044,8,s,[.85,1.1]));let i=t?-.05:-.01;return e.sphere(.055,s,[0,-.91,i],8,6,[.9,1,1.1]),e.limb([0,-.91,i],[0,-1,i+.04],.045,.048,8,s),e.cyl(.055,.068,.08,10,n,[0,-1.045,i+.05]),e.build()})}function Im(s,t,e){let n=new Pe,i=new Pe;n.add(i),i.add(Dn(q1(s,t,e)));let r=[];for(let[o,a]of[[.18,.6],[-.18,.6],[.18,-.58],[-.18,-.58]]){let l=new Pe;l.position.set(o,1.1,a),l.add(Dn(Y1(s,a<0))),i.add(l),r.push(l)}return{root:n,body:i,legs:r}}var Mm=new L,ks=new L,os=new L,wm=new ce;function ca(s,t,e=new an){return ks.set(-s[0],-s[1],-s[2]).normalize(),os.set(t[0],t[1],t[2]),os.addScaledVector(ks,-os.dot(ks)),os.lengthSq()<1e-4&&os.set(0,0,1).addScaledVector(ks,-ks.z),os.normalize(),Mm.crossVectors(ks,os),wm.makeBasis(Mm,ks,os),e.setFromRotationMatrix(wm)}var Ne=512,Lm=new Map;function Fs(s=Ne){let t=document.createElement("canvas");return t.width=s,t.height=s,t}function Dm(s,t,e,n,i){for(let r of[-s,0,s])for(let o of[-s,0,s]){let a=t+r,l=e+o;a+n<0||l+n<0||a-n>s||l-n>s||i(a,l)}}function Z1(s,t=2){let e=s.width,i=s.getContext("2d").getImageData(0,0,e,e).data,r=Fs(e),o=r.getContext("2d"),a=o.createImageData(e,e),l=(c,h)=>i[((h+e)%e*e+(c+e)%e)*4]/255;for(let c=0;c<e;c++)for(let h=0;h<e;h++){let d=(l(h+1,c)-l(h-1,c))*t,u=(l(h,c+1)-l(h,c-1))*t,f=Math.hypot(d,u,1),p=(c*e+h)*4;a.data[p]=(-d/f*.5+.5)*255,a.data[p+1]=(-u/f*.5+.5)*255,a.data[p+2]=(1/f*.5+.5)*255,a.data[p+3]=255}return o.putImageData(a,0,0),r}function Xc(s,t,e,n,i,r,o,a,l){for(let c=0;c<n;c++){let h=e()*t,d=e()*t,u=i+e()*(r-i),f=Math.round(o+e()*(a-o));Dm(t,h,d,u,(p,g)=>{let m=s.createRadialGradient(p,g,0,p,g,u);m.addColorStop(0,`rgba(${f},${f},${f},${l})`),m.addColorStop(1,`rgba(${f},${f},${f},0)`),s.fillStyle=m,s.fillRect(p-u,g-u,u*2,u*2)})}}function K1(s){let t=cn(s.length*977+13),e=Fs(),n=Fs(),i=e.getContext("2d"),r=n.getContext("2d"),o=s==="snow"?236:s==="sand"?222:210;if(i.fillStyle=`rgb(${o},${o},${o})`,i.fillRect(0,0,Ne,Ne),r.fillStyle="rgb(128,128,128)",r.fillRect(0,0,Ne,Ne),Xc(i,Ne,t,60,30,90,s==="snow"?200:150,255,.35),Xc(r,Ne,t,80,20,70,60,200,.4),s==="grass"||s==="steppe"){let a=s==="grass"?16e3:11e3;for(let l=0;l<a;l++){let c=t()*Ne,h=t()*Ne,d=t()*Math.PI*2,u=4+t()*11,f=Math.round(130+t()*125),p=s==="steppe"?12:4;Dm(Ne,c,h,u,(g,m)=>{i.strokeStyle=`rgba(${Math.min(255,f+p)},${f},${Math.max(0,f-p*2)},0.55)`,i.lineWidth=1+t()*1.4,i.beginPath(),i.moveTo(g,m),i.lineTo(g+Math.cos(d)*u,m+Math.sin(d)*u),i.stroke(),r.strokeStyle=`rgba(${f},${f},${f},0.5)`,r.lineWidth=1.5,r.beginPath(),r.moveTo(g,m),r.lineTo(g+Math.cos(d)*u,m+Math.sin(d)*u),r.stroke()})}Xc(i,Ne,t,40,6,22,120,160,.45)}else{let a=s==="snow"?9e3:14e3;for(let l=0;l<a;l++){let c=t()*Ne,h=t()*Ne,d=.6+t()*(s==="snow"?1.6:1.2),u=Math.round((s==="snow"?190:140)+t()*(s==="snow"?65:115));i.fillStyle=`rgba(${u},${u},${u},0.6)`,i.fillRect(c,h,d,d),r.fillStyle=`rgba(${u},${u},${u},0.6)`,r.fillRect(c,h,d*1.5,d*1.5)}for(let l=0;l<70;l++){let c=t()*Ne,h=Math.round(110+t()*60);r.strokeStyle=`rgba(${h},${h},${h},0.35)`,r.lineWidth=2+t()*3,r.beginPath();for(let d=-10;d<=Ne+10;d+=16)r.lineTo(d,c+Math.sin(d*.03+l)*6);r.stroke()}}return{col:e,hgt:n}}function J1(){let s=cn(4242),t=Fs(),e=Fs(),n=t.getContext("2d"),i=e.getContext("2d");n.fillStyle="rgb(95,92,88)",n.fillRect(0,0,Ne,Ne),i.fillStyle="rgb(20,20,20)",i.fillRect(0,0,Ne,Ne);let r=8,o=Ne/r;for(let a=0;a<r;a++){let l=-s()*60;for(;l<Ne;){let c=45+s()*60,h=Math.round(165+s()*60),d=Math.round(s()*10-5),u=l+2,f=a*o+2,p=Math.min(c,Ne-l)-4,g=o-4;n.fillStyle=`rgb(${h+d},${h},${h-d})`,n.fillRect(u,f,p,g);let m=185+Math.round(s()*45);i.fillStyle=`rgb(${m},${m},${m})`,i.fillRect(u+1,f+1,p-2,g-2),l+=c}}for(let a=0;a<12e3;a++){let l=Math.round(90+s()*120);n.fillStyle=`rgba(${l},${l},${l},0.25)`,n.fillRect(s()*Ne,s()*Ne,1.5,1.5)}return Xc(n,Ne,s,30,20,70,110,150,.25),{col:t,hgt:e}}function j1(){let s=cn(777),t=Fs(256),e=Fs(256),n=t.getContext("2d"),i=e.getContext("2d"),r=256,o=6,a=r/o;for(let l=0;l<o;l++){let c=Math.round(170+s()*60);n.fillStyle=`rgb(${c},${Math.round(c*.78)},${Math.round(c*.55)})`,n.fillRect(l*a,0,a,r),i.fillStyle="rgb(200,200,200)",i.fillRect(l*a+1,0,a-2,r);for(let h=0;h<14;h++){let d=l*a+s()*a,u=Math.round(c*(.6+s()*.3));n.strokeStyle=`rgba(${u},${Math.round(u*.75)},${Math.round(u*.5)},0.6)`,n.lineWidth=.7+s(),n.beginPath();for(let f=0;f<=r;f+=8)n.lineTo(d+Math.sin(f*.05+h)*1.5,f);n.stroke()}n.fillStyle="rgba(30,20,10,0.9)",n.fillRect(l*a,0,1.5,r)}return{col:t,hgt:e}}function Mu(s,t,e){let n=Lm.get(s);if(!n){let{col:o,hgt:a}=t();n={col:o,nrm:Z1(a,e)},Lm.set(s,n)}let i=new vr(n.col);i.colorSpace=xn;let r=new vr(n.nrm);for(let o of[i,r])o.wrapS=Pn,o.wrapT=Pn,o.anisotropy=4;return{map:i,normalMap:r}}function Nm(s){return Mu(`ground:${s}`,()=>K1(s),s==="snow"?1.5:2.5)}function Um(){return Mu("stone",J1,4)}function wu(){return Mu("wood",j1,3)}function km(s){return s.onBeforeCompile=t=>{t.fragmentShader=t.fragmentShader.replace("#include <map_fragment>",`#ifdef USE_MAP
        vec4 t1 = texture2D( map, vMapUv );
        vec4 t2 = texture2D( map, vMapUv * 0.137 + vec2( 0.37, 0.71 ) );
        diffuseColor *= mix( t1, t2, 0.4 ) * 1.12;
      #endif`)},s.customProgramCacheKey=()=>"antiTiling",s}var Fm={plains:{grass:"#6f9a46",grass2:"#8aab55",dirt:"#8c7650",rock:"#7d7870",trees:.004,pines:5e-4,rocks:8e-4,relief:4,sky:["#8fbfe6","#dfe9ef"],fog:"#c9d8e0"},forest:{grass:"#557f3a",grass2:"#6b8f45",dirt:"#6f5a3c",rock:"#6f6b64",trees:.02,pines:.004,rocks:8e-4,relief:5,sky:["#86b4d8","#d6e3e8"],fog:"#b9cbc8"},steppe:{grass:"#b3a45e",grass2:"#c4b46c",dirt:"#9c8456",rock:"#8e8272",trees:6e-4,pines:0,rocks:6e-4,relief:2.5,sky:["#9cc8ec","#f0e8d4"],fog:"#e2dcc8"},desert:{grass:"#d2b882",grass2:"#dcc493",dirt:"#b99a64",rock:"#a08a6a",trees:2e-4,pines:0,rocks:.0012,relief:3,sky:["#a6cdee","#f3e8cf"],fog:"#eadfc6"},snow:{grass:"#e4eaee",grass2:"#d2dce2",dirt:"#b0b4b0",rock:"#8a8e92",trees:6e-4,pines:.006,rocks:.001,relief:5,sky:["#a9c3dc","#e8eef2"],fog:"#dfe7ee"},taiga:{grass:"#5d7a55",grass2:"#dfe6ea",dirt:"#6d6450",rock:"#707478",trees:.001,pines:.02,rocks:.001,relief:5,sky:["#96b4cf","#dbe4ea"],fog:"#c8d4dc"},hills:{grass:"#7a8f4e",grass2:"#8f9a5a",dirt:"#86735a",rock:"#7c7770",trees:.003,pines:.003,rocks:.004,relief:11,sky:["#8fb9e0","#dfe6ea"],fog:"#c8d3d8"},arena:{grass:"#c9b07a",grass2:"#bfa36a",dirt:"#b0935a",rock:"#8a7a60",trees:0,pines:0,rocks:0,relief:0,sky:["#8fbfe6","#e9e2cf"],fog:"#e0d6c0"}},Zc=class{constructor(t,e,n=Math.random()*1e9|0){this.kind=t,this.type=Fm[e]?e:"plains",this.pal=Fm[this.type],this.size=t==="arena"?70:260,this.half=this.size/2,this.res=t==="arena"?36:131,this.step=this.size/(this.res-1),this.h=new Float32Array(this.res*this.res),this.rand=cn(n),this.noise=Hi(n),this.obstacles=[],this.group=new Pe,this.fort=null,this.generate()}idx(t,e){return e*this.res+t}generate(){let{res:t,step:e,half:n,pal:i}=this;for(let r=0;r<t;r++)for(let o=0;o<t;o++){let a=-n+o*e,l=-n+r*e,c=0;if(this.kind!=="arena"){c=fs(this.noise,a*.012,l*.012,4)*i.relief;let h=Gn(40,120,Math.hypot(a,l));c*=.55+.45*h,c+=h*fs(this.noise,a*.02+7,l*.02-3,3)*i.relief*.8}this.h[this.idx(o,r)]=c}this.kind==="siege"&&this.buildFortHeights()}buildFortHeights(){let t={x0:-34,x1:34,z0:-92,z1:-38,height:0,rampX:0,rampW:5,rampZ0:-38,rampZ1:-12},e=this.rawHeight(0,-60);t.height=e+7.5;for(let n=0;n<this.res;n++)for(let i=0;i<this.res;i++){let r=-this.half+i*this.step,o=-this.half+n*this.step,a=this.idx(i,n);if(r>=t.x0&&r<=t.x1&&o>=t.z0&&o<=t.z1&&(this.h[a]=t.height),Math.abs(r-t.rampX)<=t.rampW/2+.01&&o>t.z1&&o<=t.rampZ1){let c=(o-t.z1)/(t.rampZ1-t.z1),h=this.h[a];this.h[a]=t.height+(h-t.height)*c}}this.fort=t}rawHeight(t,e){let n=oe((t+this.half)/this.step,0,this.res-1.001),i=oe((e+this.half)/this.step,0,this.res-1.001),r=Math.floor(n),o=Math.floor(i),a=n-r,l=i-o,c=this.h[this.idx(r,o)],h=this.h[this.idx(r+1,o)],d=this.h[this.idx(r,o+1)],u=this.h[this.idx(r+1,o+1)];return(c*(1-a)+h*a)*(1-l)+(d*(1-a)+u*a)*l}heightAt(t,e){return this.rawHeight(t,e)}hitsWall(t,e,n){if(!this.walls)return!1;for(let i of this.walls)if(t>=i.x0&&t<=i.x1&&n>=i.z0&&n<=i.z1&&e<=i.top)return!0;return!1}level(t,e){let n=this.fort;return n?t>=n.x0-.5&&t<=n.x1+.5&&e>=n.z0-.5&&e<=n.z1+.3?1:Math.abs(t-n.rampX)<=n.rampW/2+.6&&e>n.z1&&e<=n.rampZ1+1?.5:0:0}walkable(t,e,n,i){let r=this.size/2-2;if(Math.abs(n)>r||Math.abs(i)>r)return!1;let o=this.heightAt(t,e),a=this.heightAt(n,i),l=Math.hypot(n-t,i-e)||.001;if(Math.abs(a-o)/l>1.25)return!1;if(this.fort){let c=this.level(t,e),h=this.level(n,i);if(c===1&&h===0||c===0&&h===1||c===.5&&h===0&&i<this.fort.rampZ1-.5||c===0&&h===.5&&i<this.fort.rampZ1-.5)return!1}return!0}waypoint(t,e,n,i){let r=this.fort;if(!r)return null;let o=this.level(t,e),a=this.level(n,i);if(o===a)return null;let l=[r.rampX,r.rampZ1+3],c=[r.rampX,r.rampZ1-1.5],h=[r.rampX,r.z1-3],d=[r.rampX,r.z1+1.5],u=f=>Math.hypot(t-f[0],e-f[1])<2.5;return a>o?o===0?u(l)?c:l:h:o===1?u(h)?d:h:l}material(t,e=this.std){return e?new As({roughness:.95,metalness:0,...t}):new Cs(t)}build(t,e={}){this.gfx=e,this.std=!!e.standard;let{res:n,half:i,pal:r}=this,o=new Ts(this.size,this.size,n-1,n-1);o.rotateX(-Math.PI/2);let a=o.attributes.position,l=new Float32Array(a.count*3),c=new St(r.grass),h=new St(r.grass2),d=new St(r.dirt),u=new St(r.rock),f=new St("#8f8a82"),p=new St("#7a5a36"),g=new St;for(let S=0;S<a.count;S++){let T=a.getX(S),C=a.getZ(S),_=this.heightAt(T,C);a.setY(S,_);let A=this.slopeAt(T,C),R=this.noise(T*.08,C*.08)*.5+.5,I=this.dirtNoise(T,C);if(g.copy(c).lerp(h,R),I>.72&&this.type!=="arena"&&g.lerp(d,Math.min(1,(I-.72)*2.5)),g.lerp(u,Gn(.35,.9,A)),this.fort){let O=this.level(T,C);O===1?g.copy(f).lerp(d,R*.5):O===.5?g.copy(p):A>1&&g.copy(f)}this.type==="arena"&&Math.hypot(T,C)>25&&g.copy(h).multiplyScalar(.8);let D=.92+I*.12;l[S*3]=g.r*D,l[S*3+1]=g.g*D,l[S*3+2]=g.b*D}o.setAttribute("color",new en(l,3)),o.computeVertexNormals();let m=Nm(Q1[this.type]||"grass"),y=3.5;m.map.repeat.set(this.size/y,this.size/y),m.normalMap.repeat.copy(m.map.repeat);let x=this.material({vertexColors:!0,map:m.map,normalMap:this.std?m.normalMap:null,normalScale:new ht(.8,.8)});km(x);let M=new ge(o,x);M.receiveShadow=!0,this.group.add(M),this.mesh=M;let v=new ge(new No(i*.98,i*6,48,1),this.material({color:r.grass2}));v.rotation.x=-Math.PI/2,v.position.y=-.8,this.group.add(v),this.buildVegetation(),this.buildGrass(e.grass||0),this.fort&&this.buildFort(),this.kind==="arena"&&this.buildArena(),t.add(this.group)}slopeAt(t,e){let n=this.step,i=this.heightAt(t+n,e)-this.heightAt(t-n,e),r=this.heightAt(t,e+n)-this.heightAt(t,e-n);return Math.hypot(i,r)/(2*n)}dirtNoise(t,e){return this.noise(t*.3+11,e*.3)*.5+.5}update(t){this.grassTime&&(this.grassTime.value=t)}buildVegetation(){let{half:t,pal:e}=this,n=this.rand,i=[],r=[],o=[],a=this.size*this.size,l=(g,m)=>!(Math.abs(g)<70&&Math.abs(m)>55&&Math.abs(m)<100||this.fort&&this.level(g,m)!==0||this.fort&&Math.abs(g)<55&&m>-110&&m<80),c=(g,m,y)=>{for(let x=0;x<m;x++){let M=(n()*2-1)*(t-3),v=(n()*2-1)*(t-3);Math.hypot(M,v)<45&&n()<.75||l(M,v)&&g.push([M,v,y+n()*.6])}};c(i,Math.round(a*e.trees),.8),c(r,Math.round(a*e.pines),.7),c(o,Math.round(a*e.rocks),.6);let h=new qe,d=(g,m,y,x,M,v=0)=>{let S=new Kc(50);for(let[T,C,_]of y){h.position.set(T,this.heightAt(T,C)+M*_,C);let A=x(_);h.scale.set(A[0],A[1],A[2]),h.rotation.set((n()-.5)*.08,n()*6.28,(n()-.5)*.08),h.updateMatrix();let R=null;if(v){let I=1-v+n()*v*2;R=new St().setRGB(I*(.95+n()*.1),I,I*(.9+n()*.1))}S.add(T,C,h.matrix,R)}for(let T of S.meshes(g,m))T.castShadow=!0,T.receiveShadow=!0,this.group.add(T)},u=this.type==="steppe"||this.type==="desert",f=this.material({vertexColors:!0,roughness:1}),p=this.material({vertexColors:!0,roughness:.85});d(Om("#5a4028"),f,i,g=>[g,g,g],0,.1),d(eM(u?["#5f6d33","#76803d","#4f5c2a"]:["#2f5a22","#3f6a2b","#4d7832","#2a4f1f"],5),p,i,g=>[g,g*.95,g],4.1,.16),d(Om("#4a3422",.8),f,r,g=>[g*.8,g,g*.8],0,.1),d(nM(this.type==="snow"?["#23402f","#2f4d3c","#e4ecef"]:["#1f4230","#28503a","#315c43"]),p,r,g=>[g,g,g],.6,.12),d(iM(e.rock),this.material({vertexColors:!0,roughness:.85,flatShading:!0}),o,g=>[g*1.3,g*.8,g],.15,.12);for(let[g,m,y]of i)this.obstacles.push({x:g,z:m,r:.35*y});for(let[g,m,y]of r)this.obstacles.push({x:g,z:m,r:.3*y});for(let[g,m,y]of o)this.obstacles.push({x:g,z:m,r:1*y})}buildGrass(t){let e=tM[this.type];if(!e||t<=0)return;let n=cn(99),i=rM(e,n),r=this.material({vertexColors:!0,side:On,roughness:.9}),o={value:0};r.onBeforeCompile=u=>{u.uniforms.uTime=o,u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec3 ip = vec3( instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2] );
          #else
            vec3 ip = vec3( 0.0 );
          #endif
          float sway = sin( uTime * 1.6 + ip.x * 0.21 + ip.z * 0.17 ) * 0.6 + sin( uTime * 2.9 + ip.x * 0.7 - ip.z * 0.4 ) * 0.25;
          float bend = transformed.y * transformed.y;
          transformed.x += sway * bend * 0.45;
          transformed.z += sway * bend * 0.2;`)},r.customProgramCacheKey=()=>"grass",this.grassTime=o;let a=new qe,l=new St,c=new Kc(40),h=0,d=Math.min(this.half-4,125);for(let u=0;u<t*4&&h<t;u++){let f=d*Math.sqrt(n())*(n()<.6?.75:1),p=n()*Math.PI*2,g=Math.cos(p)*f,m=Math.sin(p)*f;if(this.dirtNoise(g,m)>.74-e.sparse*.2||this.noise(g*.05-7,m*.05+3)<-.35+e.sparse||this.slopeAt(g,m)>.45||this.fort&&(this.level(g,m)!==0||Math.abs(g)<8&&m>-40&&m<-5))continue;a.position.set(g,this.heightAt(g,m)-.02,m),a.rotation.set(0,n()*6.28,0);let y=.75+n()*.6;a.scale.set(y,y*(.8+n()*.5),y),a.updateMatrix();let x=.85+n()*.3;l.setRGB(x*(.95+n()*.12),x,x*.95),c.add(g,m,a.matrix,l),h++}for(let u of c.meshes(i,r))u.receiveShadow=!0,u.castShadow=!1,this.group.add(u)}buildFort(){let t=this.fort,e=Um(),n=wu(),i=this.material({color:"#b3ada2",map:e.map,normalMap:this.std?e.normalMap:null,roughness:.9}),r=this.material({color:"#948d82",map:e.map,normalMap:this.std?e.normalMap:null,roughness:.95}),o=this.material({color:"#b08a60",map:n.map,normalMap:this.std?n.normalMap:null,roughness:.85}),a=t.height,l=1.3,c=(x,M,v,S,T,C,_=i,A=3)=>{let R=new nn(x,M,v);qc(R,x,M,v,A);let I=new ge(R,_);return I.position.set(S,T,C),I.castShadow=!0,I.receiveShadow=!0,this.group.add(I),I},h=a-this.heightAt(0,-30)+2;c(t.x1-t.x0+1,h,1,(t.x0+t.x1)/2,a-h/2,t.z1+.3,r,4),c(t.x1-t.x0+1,h,1,(t.x0+t.x1)/2,a-h/2,t.z0-.3,r,4),c(1,h,t.z1-t.z0+1,t.x0-.3,a-h/2,(t.z0+t.z1)/2,r,4),c(1,h,t.z1-t.z0+1,t.x1+.3,a-h/2,(t.z0+t.z1)/2,r,4);let d=t.rampW/2+.5;this.walls=[];let u=(x,M,v)=>{let S=M-x;if(!(S<=0)){this.walls.push({x0:x,x1:M,z0:v-.35,z1:v+.35,top:a+l+.3}),c(S,l,.6,(x+M)/2,a+l/2,v);for(let T=x+.5;T<M-.3;T+=1.6)c(.8,.6,.6,T+.4,a+l+.3,v)}};u(t.x0,t.rampX-d,t.z1-.2),u(t.rampX+d,t.x1,t.z1-.2),this.walls.push({x0:t.x0-.2,x1:t.x0+.6,z0:t.z0,z1:t.z1,top:a+l}),this.walls.push({x0:t.x1-.6,x1:t.x1+.2,z0:t.z0,z1:t.z1,top:a+l}),c(.6,l,t.z1-t.z0,t.x0+.2,a+l/2,(t.z0+t.z1)/2),c(.6,l,t.z1-t.z0,t.x1-.2,a+l/2,(t.z0+t.z1)/2),c(t.x1-t.x0,l*2,.6,(t.x0+t.x1)/2,a+l,t.z0+.2);for(let[x,M]of[[t.x0,t.z1],[t.x1,t.z1],[t.x0,t.z0],[t.x1,t.z0]]){c(4,6,4,x,a+3,M);for(let[v,S]of[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]])c(.9,.8,.9,x+v,a+6.4,M+S);this.obstacles.push({x,z:M,r:2.4})}c(12,10,10,0,a+5,t.z0+9);let f=new ge(new Ri(8.6,5,4),this.material({color:"#7d3326",roughness:.8,flatShading:!0}));f.position.set(0,a+12.5,t.z0+9),f.rotation.y=Math.PI/4,f.castShadow=!0,this.group.add(f),this.obstacles.push({x:0,z:t.z0+9,r:6.5});let p=Math.hypot(t.rampZ1-t.z1,a-this.heightAt(t.rampX,t.rampZ1)),g=new nn(t.rampW+.6,.25,p);qc(g,t.rampW+.6,.25,p,2.5);let m=new ge(g,o),y=(t.z1+t.rampZ1)/2;m.position.set(t.rampX,(a+this.heightAt(t.rampX,t.rampZ1))/2-.05,y),m.rotation.x=Math.atan2(a-this.heightAt(t.rampX,t.rampZ1),t.rampZ1-t.z1),m.receiveShadow=!0,m.castShadow=!0,this.group.add(m);for(let x of[-1,1]){let M=new ge(new nn(.2,.8,p),o);M.position.copy(m.position),M.position.x+=x*(t.rampW/2+.3),M.position.y+=.4,M.rotation.x=m.rotation.x,M.castShadow=!0,this.group.add(M)}this.bannerSpots=[[t.x0,a+7,t.z1],[t.x1,a+7,t.z1],[0,a+15,t.z0+9]]}buildArena(){let t=wu(),e=this.material({color:"#8f6a45",map:t.map,normalMap:this.std?t.normalMap:null}),n=this.material({color:"#a48058",map:t.map}),i=this.material({color:"#8f6a45",map:t.map}),r=25,o=48;for(let a=0;a<o;a++){let l=a/o*Math.PI*2,c=new nn(3.4,2.2,.3);qc(c,3.4,2.2,.3,2);let h=new ge(c,e);h.position.set(Math.cos(l)*r,1.1,Math.sin(l)*r),h.rotation.y=-l+Math.PI/2,h.castShadow=!0,h.receiveShadow=!0,this.group.add(h);let d=new nn(3.6,1,4);qc(d,3.6,1,4,2);let u=new ge(d,a%2?n:i);u.position.set(Math.cos(l)*(r+4),.5+a%3*.1,Math.sin(l)*(r+4)),u.rotation.y=-l+Math.PI/2,u.receiveShadow=!0,this.group.add(u)}this.arenaR=r-.8}},Q1={plains:"grass",forest:"grass",steppe:"steppe",desert:"sand",snow:"snow",taiga:"grass",hills:"grass",arena:"sand"},tM={plains:{base:"#2f4f1c",tip:"#8fb152",sparse:0},forest:{base:"#284418",tip:"#78a044",sparse:.05},hills:{base:"#34501f",tip:"#94ad55",sparse:.1},steppe:{base:"#6b6231",tip:"#d4c47c",sparse:.05},taiga:{base:"#2c4424",tip:"#7f9a58",sparse:.25},snow:{base:"#6f7262",tip:"#c9cbb4",sparse:.45}},Kc=class{constructor(t){this.size=t,this.cells=new Map}add(t,e,n,i){let r=`${Math.floor(t/this.size)},${Math.floor(e/this.size)}`,o=this.cells.get(r);o||this.cells.set(r,o=[]),o.push([n.clone(),i?i.clone():null])}meshes(t,e){let n=[];for(let i of this.cells.values()){let r=new Mo(t,e,i.length);i.forEach(([o,a],l)=>{r.setMatrixAt(l,o),a&&r.setColorAt(l,a)}),r.computeBoundingSphere(),n.push(r)}return n}};function qc(s,t,e,n,i){let r=s.attributes.uv,o=[[n,e],[n,e],[t,n],[t,n],[t,e],[t,e]];for(let a=0;a<6;a++){let[l,c]=o[a];for(let h=0;h<4;h++){let d=a*4+h;r.setXY(d,r.getX(d)*l/i,r.getY(d)*c/i)}}r.needsUpdate=!0}function Jc(s,t,e){let n=cn(e),i=s.attributes.position,r=new Map;for(let o=0;o<i.count;o++){let a=`${i.getX(o).toFixed(3)},${i.getY(o).toFixed(3)},${i.getZ(o).toFixed(3)}`,l=r.get(a);l||(l=[(n()-.5)*t,(n()-.5)*t,(n()-.5)*t],r.set(a,l)),i.setXYZ(o,i.getX(o)+l[0],i.getY(o)+l[1],i.getZ(o)+l[2])}return s}function Om(s,t=1){let e=new gn;e.cyl(.14*t,.3*t,3.4,8,s,[0,1.7,0]),e.cyl(.05,.1,1.4,5,s,[.45,2.8,0],[0,0,-.9]),e.cyl(.05,.09,1.2,5,s,[-.35,3.1,.2],[.3,0,.8]);for(let n=0;n<4;n++){let i=n/4*Math.PI*2;e.box(.16,.16,.7,s,[Math.cos(i)*.3,.05,Math.sin(i)*.3],[0,-i+Math.PI/2,0])}return e.build()}function eM(s,t){let e=new gn,n=cn(t);e.add(Jc(new Ss(1.75,1),.5,t),s[0],[0,0,0]);let i=11;for(let r=0;r<i;r++){let o=1-(r+.5)/i*1.7,a=r*2.39996+n()*.5,l=Math.sqrt(Math.max(0,1-o*o)),c=1.35+n()*.5,h=.8+n()*.45,d=Jc(new Ss(h,1),h*.32,Math.floor(n()*1e6));e.add(d,s[Math.floor(n()*s.length)],[Math.cos(a)*l*c*1.12,o*c*.85+.2,Math.sin(a)*l*c*1.12])}return Bm(e.build(),(r,o)=>o.set(r.x,r.y-.1,r.z),2.9,-2,2.6,.55,1.12)}function nM(s){let t=new gn;return[[2.1,2.4,1.6],[1.75,2.2,2.6],[1.45,2,3.5],[1.1,1.8,4.35],[.75,1.6,5.1],[.4,1.2,5.8]].forEach(([n,i,r],o)=>{let a=Jc(new Ri(n,i,11,2),.2,31+o),l=a.attributes.position;for(let c=0;c<l.count;c++){let h=Math.hypot(l.getX(c),l.getZ(c))/n;l.setY(c,l.getY(c)-h*h*.35)}t.add(a,s[o%2],[0,r,0],[0,o*.5,0]),s[2]&&o%2===0&&t.add(new Ri(n*.55,i*.35,11),s[2],[0,r+i*.33,0])}),Bm(t.build(),(n,i)=>i.set(n.x,Math.hypot(n.x,n.z)*.7,n.z),0,.5,6,.55,1.12)}var ei=new L,Yc=new L;function Bm(s,t,e,n,i,r,o){s.computeVertexNormals();let a=s.attributes.position,l=s.attributes.normal,c=s.attributes.color;for(let h=0;h<a.count;h++){Yc.set(a.getX(h),a.getY(h),a.getZ(h)),t(Yc,ei),ei.lengthSq()<1e-6&&ei.set(0,1,0),ei.normalize().multiplyScalar(.8),ei.x+=l.getX(h)*.2,ei.y+=l.getY(h)*.2,ei.z+=l.getZ(h)*.2,ei.normalize(),l.setXYZ(h,ei.x,ei.y,ei.z);let d=r+(o-r)*Gn(n,i,Yc.y);e&&(d*=.62+.38*Gn(.35,.95,Yc.length()/e)),c.setXYZ(h,c.getX(h)*d,c.getY(h)*d,c.getZ(h)*d)}return s}function iM(s){let t=Jc(new Ss(1,1),.35,7),e=new gn;return e.add(t,s,[0,0,0]),sM(e.build(),-1,1,.75,1.15)}function sM(s,t,e,n,i){let r=s.attributes.position,o=s.attributes.color;for(let a=0;a<r.count;a++){let l=Gn(t,e,r.getY(a)),c=n+(i-n)*l;o.setXYZ(a,o.getX(a)*c,o.getY(a)*c,o.getZ(a)*c)}return s.computeVertexNormals(),s}function rM(s,t){let e=[],n=[],i=[],r=new St(s.base),o=new St(s.tip),a=r.clone().lerp(o,.55),l=9;for(let h=0;h<l;h++){let d=t()*Math.PI*2,u=(t()-.5)*.5,f=(t()-.5)*.5,p=.28+t()*.38,g=.028+t()*.02,m=(t()-.2)*.22,y=Math.cos(d),x=Math.sin(d),M=(I,D,O)=>[u+I*y-O*x,D,f+I*x+O*y],v=M(-g,0,0),S=M(g,0,0),T=M(-g*.7,p*.55,m*.4),C=M(g*.7,p*.55,m*.4),_=M(0,p,m),A=[[v,S,C],[v,C,T],[T,C,_]],R=[[r,r,a],[r,a,a],[a,a,o]];A.forEach((I,D)=>{for(let O=0;O<3;O++){e.push(...I[O]),i.push(0,1,0);let N=R[D][O];n.push(N.r,N.g,N.b)}})}let c=new be;return c.setAttribute("position",new Kt(e,3)),c.setAttribute("normal",new Kt(i,3)),c.setAttribute("color",new Kt(n,3)),c.computeBoundingSphere(),c}var ni={windup:.42,swing:.3,hitAt:.45,recover:.34,bounce:.6,stun:.38,blockRaise:.1,switch:.55};function kr(s){switch(s){case"right":return"left";case"left":return"right";case"overhead":return"up";default:return"down"}}function zm(s,t){let e=s.dirs||["right"];return e.includes(t)?t:t==="thrust"&&e.includes("overhead")?"overhead":(t==="left"||t==="right")&&e.includes("thrust")&&!e.includes("left")?"thrust":t==="overhead"&&e.includes("right")?"right":e[0]}function Hm(s,t){return t==="thrust"&&s.thrust?s.thrust:s.swing?s.swing:s.thrust||[10,"blunt"]}var oM={cut:.5,pierce:.33,blunt:.25},aM={cut:.012,pierce:.009,blunt:.007};function Os(s,t,e,n=Math.random){let i=e*(oM[t]??.4)*(.5+n()*.5),r=Math.min(.75,e*(aM[t]??.01));return Math.max(0,s-i)*(1-r)}function Vm(s,t,e){let n=t.action;if(n.s!=="block"||n.t<ni.blockRaise)return!1;let i=Math.atan2(s.pos.x-t.pos.x,s.pos.z-t.pos.z),r=Math.abs(ze(i-t.aimYaw)),o=t.activeShield();return o?r<(wt[o].arc||1.4):r>1.1?!1:n.blockDir===kr(e)}function Gm(s,t,e,n){let i=e.reach+.55+(t.horse?.5:0),r=s.nearby(t.pos.x,t.pos.z,i+1.6),o=null,a=1/0;for(let c of r){if(c===t||!c.alive||!s.areEnemies(t,c))continue;let h=c.pos.x-t.pos.x,d=c.pos.z-t.pos.z,u=Math.hypot(h,d)-c.radius;if(u>i||Math.abs(c.pos.y-t.pos.y)>2.6)continue;let f=ze(Math.atan2(h,d)-t.aimYaw),p;if(n==="left"||n==="right"){if(Math.abs(f)>1.3)continue;p=n==="right"?f:-f}else{let g=n==="thrust"?.38:.5;if(Math.abs(f)>g+Math.atan2(c.radius,Math.max(.3,u+c.radius)))continue;p=u}p<a&&(a=p,o=c)}if(!o)return null;let l=!1;if(o.horse&&!t.horse){let c=e.reach>=1.5;l=!(n==="overhead"||c)&&Math.random()<.55}return{target:o,horse:l}}function bu(s,t,e=!1){let n=t.pos.x-s.pos.x,i=t.pos.z-s.pos.z,r=Math.hypot(n,i)||1,o=((s.vel.x-t.vel.x)*n+(s.vel.z-t.vel.z)*i)/r;return e?oe(1+o*.12,.6,2.6):oe(1+o*.05,.75,1.7)}var Su=(s,t)=>ca(s,t),eh=Math.PI/2;function Oe(s,t,e=0,n=0){let i=new L(s[0],s[1],s[2]).normalize(),r=new L(t[0],t[1],t[2]).normalize(),o=r.dot(i),a=r.clone().addScaledVector(i,-o),l;return a.lengthSq()<1e-4?(a.set(0,1,0).addScaledVector(i,-i.y),l=o>0?eh:-eh):l=Math.atan2(o,a.length()),{q:ca([i.x,i.y,i.z],[a.x,a.y,a.z]),wrist:l,twist:e,pitch:n}}var fe={idle:Oe([-.15,-1,.25],[-.05,.45,1]),idlePole:Oe([-.2,-1,.15],[0,.12,1]),idleLance:Oe([-.2,-1,.15],[0,1,.25]),idleTwo:Oe([-.05,-.75,.6],[.15,1,.45]),couch:Oe([-.28,-.96,-.1],[0,.02,1]),lowered:Oe([-.12,-1,.05],[0,-.3,1]),ready:{right:Oe([-.9,.35,-.3],[-.4,.5,-.8],-.7,0),left:Oe([.7,.45,.1],[.5,.4,-.8],.6,0),overhead:Oe([-.25,1,-.15],[0,.2,-1],-.1,-.15),thrust:Oe([-.35,-.9,-.25],[0,.05,1],-.35,0)},strike:{right:Oe([.75,-.05,.65],[1,.05,.35],.6,.05),left:Oe([-.8,-.05,.55],[-1,.05,.3],-.6,.05),overhead:Oe([-.1,-.35,1],[0,-.6,1],0,.28),thrust:Oe([-.1,0,1],[0,-.02,1],.25,.1)},block:{left:Oe([.3,-.2,.8],[.1,1,.1]),right:Oe([-.7,-.2,.6],[-.1,1,.1]),up:Oe([-.2,.5,.8],[1,.1,0]),down:Oe([-.1,-.5,.8],[.7,.6,.2])},bowRest:Oe([.05,-.1,1],[0,1,0]),bowDraw:Oe([-.6,.12,-.3],[0,1,0]),xbow:Oe([-.12,-.2,1],[0,0,1]),xbowReload:Oe([-.1,-1,.35],[0,-.8,.6])},jc={free:Su([.15,-1,.1],[0,0,1]),bow:Oe([.02,0,1],[0,1,0]).q,xbow:Su([-.25,-.15,1],[0,1,0]),lance:Su([.2,-.9,.3],[0,0,1])},Qc={idle:{pos:new L(.33,.1,.18),rotY:1,rotX:0},block:{pos:new L(.06,.4,.45),rotY:.05,rotX:-.08},back:{pos:new L(0,.3,-.19),rotY:Math.PI,rotX:0},ride:{pos:new L(.36,.14,.12),rotY:1.25,rotX:0}},Wm=new L(.28,.53,0),lM=new L(-.28,.53,0),th=new an,$m=new an,Di=new L,Tu=new L,Fr=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2,cM=1,as=class{constructor(t,e){this.battle=t,this.id=cM++,this.team=e.team,this.key=e.key,this.troopId=e.troopId||null,this.isPlayer=!!e.isPlayer,this.isHero=!!e.hero,this.alive=!0,this.pos=new L(e.x,t.terrain.heightAt(e.x,e.z),e.z),this.vel=new L,this.yaw=e.yaw||0,this.faceYaw=this.yaw,this.aimYaw=this.yaw,this.aimPitch=0,this.move={x:0,z:0,walk:!1},this.ride={throttle:0,turn:0},this.action={s:"idle",t:0,dur:0},this.couched=!1,this.couchCd=0,this.loaded=!0,this.fallT=0,this.lastHitBy=null,this.kills=0,this.wounded=!1,this.bumpCd=0,this.ai={nextThink:Math.random()*.4,attackCd:Math.random(),strafe:Math.random()<.5?1:-1,strafeT:0},this.group=e.group||"inf",this.name=e.name||"";let n=Math.random,i=h=>h&&h.length?h[Math.floor(n()*h.length)]:null,r;if(e.loadout)r=e.loadout;else if(e.hero){let h=e.hero.equipment;r={weapons:[h.w1,h.w2,h.w3].filter(Boolean),shield:h.shield,armor:h.armor,helmet:h.helmet,horse:h.horse}}else{let h=Gt[this.troopId];r={weapons:[i(h.eq.melee),i(h.eq.ranged)].filter(Boolean),shield:i(h.eq.shield),armor:i(h.eq.armor),helmet:i(h.eq.helmet),horse:i(h.eq.horse)}}r.weapons.length||(r.weapons=["club"]),this.weapons=r.weapons,this.shield=r.shield||null,this.armorItem=r.armor?wt[r.armor]:null,this.helmItem=r.helmet?wt[r.helmet]:null,this.bodyArmor=this.armorItem?this.armorItem.armor:0,this.headArmor=this.helmItem?this.helmItem.armor:0,this.ammo={};for(let h of this.weapons)wt[h].slot==="ranged"&&(this.ammo[h]=wt[h].ammo);if(e.hero){let h=e.hero;this.maxHp=h.maxHp,this.hp=Math.max(1,h.hp),this.atkSpeed=.95+h.attrs.agi*.012,this.power=1+h.skills.power_strike*.08+h.attrs.str*.01,this.rpower=1+h.skills.power_draw*.1,this.runSpeed=4.7*(1+h.skills.athletics*.04),this.riding=h.skills.riding,this.blockSkill=this.isPlayer?.6:Math.min(.85,.35+h.level*.05),this.aimErr=this.isPlayer?.012:Math.max(.015,.05-(h.skills.power_draw||0)*.006),this.tier=Math.max(3,Math.round(h.level/2))}else if(this.troopId){let h=Gt[this.troopId];this.maxHp=h.hp,this.hp=h.hp,this.atkSpeed=.88+h.ms*.02,this.power=1+h.tier*.05,this.rpower=1+h.rs*.03,this.runSpeed=3.95+h.ms*.06,this.riding=h.rd,this.blockSkill=Math.min(.88,.16+h.ms*.075),this.aimErr=Math.max(.012,.062-h.rs*.0048),this.tier=h.tier}else this.maxHp=e.hp||60,this.hp=this.maxHp,this.atkSpeed=1,this.power=1.1,this.rpower=1,this.runSpeed=4.3,this.riding=3,this.blockSkill=.5+Math.random()*.3,this.aimErr=.03,this.tier=3;this.reaction=.28-Math.min(.18,this.blockSkill*.18),this.horse=null,r.horse&&!e.noHorse&&this.mountHorse(this.makeHorse(r.horse,e.colors)),this.radius=this.horse?.85:.36,this.wi=0;let o=this.weapons.findIndex(h=>wt[h].slot==="ranged"),a=this.weapons.findIndex(h=>wt[h].slot==="melee");if(!this.isPlayer){let h=this.troopId?Gt[this.troopId]:null;(h&&(h.type==="arch"||h.type==="harch")||e.preferRanged)&&o>=0?this.wi=o:a>=0&&(this.wi=a)}let l=e.colors||{team:"#888888",team2:"#dddddd"},c=Math.random;this.rig=Rm({look:this.armorItem?this.armorItem.look:"cloth",helmet:this.helmItem?this.helmItem.look:null,team:l.team,team2:l.team2,skin:Em(c),hair:Am(c),beard:c()<.45,pants:["#4a3a2a","#3a3a44","#5a4a3a","#2e3a2a"][Math.floor(c()*4)]}),this.rig.root.rotation.order="YXZ",this.rig.torso.rotation.order="YXZ",t.scene.add(this.rig.root),this.colors=l,this.setupMeshes(),this.walkPhase=Math.random()*6,this.animate(0)}get weapon(){return wt[this.weapons[this.wi]]}isRanged(){return this.weapon.slot==="ranged"}hasAmmo(){let t=this.weapons[this.wi];return this.weapon.slot!=="ranged"||(this.ammo[t]||0)>0}canUseWeapon(t=this.weapon){return!(t.slot==="ranged"&&this.horse&&!t.mounted)}activeShield(){if(!this.shield)return null;let t=this.weapon;return t.twoHanded||t.cls==="bow"||t.cls==="crossbow"?null:this.shield}makeHorse(t,e){let n=wt[t],i=Im(n.coat,e?e.team:"#777",!!n.barding);return i.root.rotation.order="YXZ",this.battle.scene.add(i.root),{item:n,hp:n.hp,maxHp:n.hp,armor:n.armor,maxSpeed:n.speed*(1+this.riding*.03),turn:1.45*n.maneuver*(1+this.riding*.03),speed:0,yaw:this.yaw,alive:!0,rig:i,phase:Math.random()*6,pos:this.pos,hoofT:0}}mountHorse(t){t.pos&&t.pos!==this.pos&&(this.pos.copy(t.pos),this.yaw=t.yaw),t.pos=this.pos,t.yaw=this.yaw,t.rider=this,this.horse=t,this.radius=.85}setupMeshes(){let t=this.rig;for(let i of[this.weaponMesh,this.shieldMesh,this.backMesh])i&&i.parent&&i.parent.remove(i);let e=this.weapon;if(this.weaponMesh=Dn(Ur(e.model)),e.cls==="bow"?t.handL.add(this.weaponMesh):t.wristR.add(this.weaponMesh),this.shield){let i=wt[this.shield];this.shieldMesh=Dn(Pm(i.model,i.color,this.colors.team)),t.shieldMount.add(this.shieldMesh)}let n=this.weapons.find((i,r)=>r!==this.wi&&(wt[i].cls==="bow"||wt[i].cls==="crossbow"));n?(this.backMesh=Dn(Ur(wt[n].model)),this.backMesh.rotation.set(0,eh,.6),this.backMesh.position.set(0,0,-.04),t.backMount.add(this.backMesh)):this.backMesh=null}busy(){let t=this.action.s;return t==="stun"||t==="bounce"||t==="switch"||t==="dead"||t==="reload"}setAction(t,e=0,n={}){this.action={s:t,t:0,dur:e,...n}}beginAttack(t){if(!this.alive||this.busy())return!1;let e=this.weapon;if(e.slot==="ranged")return this.beginDraw();let n=this.action.s;if(n==="idle"||n==="block"||n==="recover"&&this.action.t>this.action.dur*.5){let i=this.couched?"thrust":zm(e,t),r=e.speed*this.atkSpeed;return this.setAction("windup",ni.windup/r,{dir:i,release:!1,id:++this.battle.attackSeq,holdFor:0}),this.couched=!1,!0}return!1}releaseAttack(){let t=this.action;t.s==="windup"?t.release=!0:t.s==="hold"?this.toSwing():(t.s==="draw"||t.s==="aim")&&this.releaseDraw()}toSwing(){let e=this.weapon.speed*this.atkSpeed,n=this.action,i=n.s==="hold"?n.t:0;this.setAction("swing",ni.swing/e,{dir:n.dir,id:n.id,hitDone:!1,holdT:i}),this.battle.sound("swing",this)}beginBlock(t){if(!this.alive||this.busy())return!1;let e=this.action.s;return e==="block"?(this.action.blockDir=t,!0):this.isRanged()?!1:e==="idle"||e==="windup"||e==="hold"||e==="recover"&&this.action.t>this.action.dur*.3?(this.setAction("block",0,{blockDir:t}),!0):!1}endBlock(){this.action.s==="block"&&this.setAction("idle")}stun(t){this.alive&&(this.setAction("stun",t),this.couched=!1)}switchWeapon(t){return!this.alive||t===this.wi||t<0||t>=this.weapons.length||this.busy()?!1:(this.setAction("switch",ni.switch,{to:t}),this.couched=!1,!0)}nextWeapon(t=1){this.weapons.length<2||this.switchWeapon((this.wi+t+this.weapons.length)%this.weapons.length)}beginDraw(){let t=this.weapon,e=this.weapons[this.wi];if((this.ammo[e]||0)<=0||!this.canUseWeapon(t))return!1;let n=this.action.s;if(n!=="idle"&&n!=="recover")return!1;if(t.cls==="crossbow"){if(!this.loaded)return!1;this.setAction("aim",0,{ready:.25})}else{let i=.8+(this.isHero?this.battle.heroSkill("power_draw")*.03:this.aimErr<.03?.3:.15);this.setAction("draw",t.draw/i)}return!0}releaseDraw(){let t=this.action,e=this.weapon;if(t.s==="draw"){e.cls==="throw"&&t.t>t.dur*.6?this.shoot():this.setAction("idle");return}if(t.s==="aim"){if(t.ready&&t.t<t.ready){t.releaseQueued=!0;return}this.shoot()}}spread(){let t=this.weapon,e=(1-(t.acc||.8))*.07+this.aimErr*(this.isPlayer?.3:1),n=this.action;t.cls==="bow"&&n.s==="aim"&&n.t>1.6&&(e+=Math.min(.06,(n.t-1.6)*.03));let i=this.horse?Math.abs(this.horse.speed):Math.hypot(this.vel.x,this.vel.z);return e+=i*(this.horse?.0025:.006),n.s==="draw"&&(e+=.05*(1-n.t/Math.max(.01,n.dur))),e}shoot(t){let e=this.weapon,n=this.weapons[this.wi];(this.ammo[n]||0)<=0||(this.ammo[n]--,this.battle.fireProjectile(this,e,t),e.cls==="crossbow"&&(this.loaded=!1),this.setAction("recover",.35))}takeDamage(t,e,n,i={}){if(!this.alive)return;if(this.isPlayer&&(t*=this.battle.settings.playerDamage??1),this.hp-=t,this.lastHitBy=e,this.hp<=0){this.die(e,n);return}let r=t>12;!i.noStun&&(r||this.action.s!=="swing"||this.action.t<this.action.dur*.3)&&this.stun(ni.stun+(r?.12:0)),i.push&&!this.horse&&(this.vel.x+=i.push[0],this.vel.z+=i.push[1])}damageHorse(t,e){let n=this.horse;!n||!n.alive||(n.hp-=t,n.hp<=0&&this.killHorse(e))}killHorse(t){let e=this.horse;this.isPlayer?this.battle.hud.message("\u0412\u0430\u0448 \u043A\u0456\u043D\u044C \u0437\u0430\u0433\u0438\u043D\u0443\u0432!","#ff9a8a"):t&&t.isPlayer&&this.battle.hud.message("\u0412\u0438 \u0432\u0431\u0438\u043B\u0438 \u043A\u043E\u043D\u044F \u043F\u0456\u0434 \u0432\u0435\u0440\u0448\u043D\u0438\u043A\u043E\u043C","#ffe9b0"),e.alive=!1,e.rider=null,this.battle.addCorpseHorse(e),this.horse=null,this.radius=.36,this.vel.set(0,0,0),this.stun(1.3),this.hp-=5,this.hp<=0&&this.die(t,"blunt")}die(t,e){if(this.alive){if(this.alive=!1,this.hp=0,this.setAction("dead"),this.couched=!1,this.fallDir=Math.random()<.5?1:-1,this.horse){let n=this.horse;n.rider=null,this.battle.releaseHorse(n),this.horse=null;let i=this.fallDir;this.pos=this.pos.clone(),this.pos.x+=Math.cos(this.yaw)*.9*i,this.pos.z-=Math.sin(this.yaw)*.9*i,this.pos.y=this.battle.terrain.heightAt(this.pos.x,this.pos.z)}this.battle.onDeath(this,t,e)}}updateAction(t){let e=this.action;switch(e.t+=t,this.couchCd>0&&(this.couchCd-=t),this.bumpCd>0&&(this.bumpCd-=t),e.s){case"windup":e.t>=e.dur&&(e.release?this.toSwing():this.setAction("hold",0,{dir:e.dir,id:e.id,holdFor:e.holdFor}));break;case"hold":!this.isPlayer&&e.t>=(e.holdFor||0)&&this.toSwing();break;case"swing":!e.hitDone&&e.t>=e.dur*ni.hitAt&&(e.hitDone=!0,this.battle.resolveMelee(this)),this.action===e&&e.t>=e.dur&&this.setAction("recover",ni.recover/(this.weapon.speed*this.atkSpeed),{dir:e.dir});break;case"recover":case"bounce":case"stun":e.t>=e.dur&&this.setAction("idle");break;case"switch":e.t>=e.dur&&(this.wi=e.to,this.setupMeshes(),this.setAction("idle"),this.weapon.cls==="crossbow"&&!this.loaded&&this.startReload());break;case"draw":e.t>=e.dur&&this.setAction("aim",0);break;case"aim":e.releaseQueued&&e.t>=(e.ready||0)&&this.shoot();break;case"reload":e.t>=e.dur&&(this.loaded=!0,this.setAction("idle"));break;default:}this.action.s==="idle"&&this.weapon.cls==="crossbow"&&!this.loaded&&(this.ammo[this.weapons[this.wi]]||0)>0&&this.startReload();let n=this.weapon;this.horse&&n.lance&&this.action.s==="idle"&&this.horse.speed>7&&this.couchCd<=0?this.couched=!0:(!this.horse||!n.lance||this.horse.speed<5.5||this.action.s!=="idle")&&(this.couched=!1),this.couched&&this.battle.resolveCouch(this)}startReload(){if(this.horse&&!this.weapon.mounted)return;let t=this.weapon;this.setAction("reload",t.reload*(this.isHero?1:1.1))}moveSpeedFactor(){let t=this.action.s;return t==="windup"||t==="hold"||t==="swing"?.62:t==="block"?this.activeShield()?.55:.65:t==="draw"||t==="aim"?this.weapon.cls==="throw"?.7:.4:t==="reload"?.35:t==="stun"||t==="bounce"?.25:1}integrate(t){let e=this.battle.terrain;if(!this.alive){this.fallT=Math.min(1,this.fallT+t*2.2);return}if(this.horse){let r=this.horse,o=r.turn*(Math.abs(r.speed)<3?1.6:1.15);r.yaw+=oe(this.ride.turn,-1,1)*o*t;let a=this.ride.throttle,l=r.maxSpeed*(this.move.walk?.45:1),c=a>.05?l*a:a<-.05?-2:0;r.speed<c?r.speed=Math.min(c,r.speed+5.5*t):r.speed=Math.max(c,r.speed-(a<-.05?9:a>.05?4:2.5)*t);let h=e.heightAt(this.pos.x+Math.sin(r.yaw)*1.5,this.pos.z+Math.cos(r.yaw)*1.5)-this.pos.y;h>.3&&(r.speed*=1-Math.min(.5,h*.5)*t*3),this.yaw=r.yaw,this.vel.x=Math.sin(r.yaw)*r.speed,this.vel.z=Math.cos(r.yaw)*r.speed}else{let r=this.moveSpeedFactor(),o=this.move.x,a=this.move.z,l=Math.hypot(o,a);l>1&&(o/=l,a/=l);let c=this.runSpeed*r*(this.move.walk?.4:1);if(l>.01){let p=Math.atan2(o,a),g=Math.abs(ze(p-this.yaw));g>2?c*=.62:g>1.2&&(c*=.82)}let h=o*c,d=a*c,u=Math.min(1,t*9);this.vel.x+=(h-this.vel.x)*u,this.vel.z+=(d-this.vel.z)*u;let f=this.isPlayer?16:7;this.yaw=Gu(this.yaw,this.faceYaw,f*t)}let n=this.pos.x+this.vel.x*t,i=this.pos.z+this.vel.z*t;e.walkable(this.pos.x,this.pos.z,n,i)||(e.walkable(this.pos.x,this.pos.z,n,this.pos.z)?(i=this.pos.z,this.vel.z=0):e.walkable(this.pos.x,this.pos.z,this.pos.x,i)?(n=this.pos.x,this.vel.x=0):(n=this.pos.x,i=this.pos.z,this.vel.set(0,0,0),this.horse&&(this.horse.speed*=.2))),this.pos.x=n,this.pos.z=i,this.battle.collideObstacles(this),this.pos.y=e.heightAt(this.pos.x,this.pos.z),this.horse&&(this.horse.hoofT-=t*Math.abs(this.horse.speed),this.horse.hoofT<0&&Math.abs(this.horse.speed)>2&&(this.horse.hoofT=2.2,this.battle.sound("hoof",this)))}rightPose(t){let e=this.action,n=this.weapon,i=n.lance?this.couched?fe.couch:fe.idleLance:n.cls==="spear"?fe.idlePole:n.twoHanded?fe.idleTwo:fe.idle,r=(a,l,c)=>{t.q.copy(a.q).slerp(l.q,c),t.wrist=a.wrist+(l.wrist-a.wrist)*c,t.twist=(a.twist||0)+((l.twist||0)-(a.twist||0))*c,t.pitch=(a.pitch||0)+((l.pitch||0)-(a.pitch||0))*c};if(n.cls==="bow"){e.s==="draw"?r(fe.bowRest,fe.bowDraw,Fr(Math.min(1,e.t/Math.max(.01,e.dur)))):e.s==="aim"?r(fe.bowDraw,fe.bowDraw,0):r(fe.bowRest,fe.lowered,e.s==="recover"?Math.min(1,e.t/.35):1);return}if(n.cls==="crossbow"){e.s==="reload"?r(fe.xbowReload,fe.xbowReload,0):e.s==="aim"||e.s==="recover"?r(fe.xbow,fe.xbow,0):r(fe.xbowReload,fe.xbow,.4);return}if(n.cls==="throw"){e.s==="draw"?r(fe.idle,fe.ready.overhead,Fr(Math.min(1,e.t/Math.max(.01,e.dur)))):e.s==="aim"?r(fe.ready.overhead,fe.ready.overhead,0):e.s==="recover"?r(fe.strike.overhead,fe.idle,Math.min(1,e.t/.35)):r(fe.idle,fe.idle,0);return}let o=e.dir||"right";switch(e.s){case"windup":r(i,fe.ready[o],Fr(Math.min(1,e.t/Math.max(.01,e.dur))));break;case"hold":r(fe.ready[o],fe.ready[o],0),t.twist+=Math.sin(e.t*30)*.01;break;case"swing":r(fe.ready[o],fe.strike[o],Fr(Math.min(1,e.t/Math.max(.01,e.dur))));break;case"recover":r(fe.strike[o],i,Fr(Math.min(1,e.t/Math.max(.01,e.dur))));break;case"bounce":r(fe.ready[o]||i,i,Math.min(1,e.t/Math.max(.01,e.dur))),t.pitch-=.15*(1-e.t/e.dur);break;case"block":this.activeShield()?r(i,i,0):r(i,fe.block[e.blockDir||"up"],Math.min(1,e.t/ni.blockRaise));break;case"stun":r(i,i,0),t.pitch=-.2*(1-e.t/Math.max(.01,e.dur));break;default:r(i,i,0)}}animate(t){let e=this.rig,n=e.root;if(!this.alive){let h=Fr(this.fallT);n.position.set(this.pos.x,this.pos.y+.12*h,this.pos.z),n.rotation.y=this.yaw,n.rotation.x=-eh*h*(this.fallDir>0?1:-.95),e.legL.rotation.set(0,0,0),e.legR.rotation.set(0,0,.1),e.armR.quaternion.slerp(fe.lowered.q,Math.min(1,t*5));return}let i=0,r;if(this.horse){let h=this.horse,d=h.rig,u=Math.abs(h.speed);h.phase+=u*t*1.25;let f=Math.min(.75,u*.085),p=h.phase;d.legs[0].rotation.x=Math.sin(p)*f,d.legs[1].rotation.x=Math.sin(p+.5)*f,d.legs[2].rotation.x=Math.sin(p+Math.PI)*f,d.legs[3].rotation.x=Math.sin(p+Math.PI+.5)*f,i=Math.abs(Math.sin(p))*.08*Math.min(1,u/6),d.body.position.y=i,d.body.rotation.x=Math.sin(p*2)*.025*Math.min(1,u/6),d.root.position.copy(this.pos),d.root.rotation.y=h.yaw,n.position.set(this.pos.x,this.pos.y+.8+i,this.pos.z),n.rotation.y=h.yaw,n.rotation.x=0,e.hips.position.y=.92,e.legL.rotation.set(-1.15,0,.42),e.legR.rotation.set(-1.15,0,-.42),r=oe(ze(this.aimYaw-h.yaw),-1.5,1.5)}else{n.position.copy(this.pos),n.rotation.y=this.yaw,n.rotation.x=0;let h=Math.hypot(this.vel.x,this.vel.z);this.walkPhase+=h*t*2.4;let d=Math.min(.75,h*.18),u=Math.atan2(this.vel.x,this.vel.z),f=ze(u-this.yaw),p=Math.cos(f),g=Math.sin(f),m=Math.sin(this.walkPhase);e.legL.rotation.set(m*d*p,0,m*d*g*.5),e.legR.rotation.set(-m*d*p,0,-m*d*g*.5),e.hips.position.y=.92-Math.abs(Math.cos(this.walkPhase))*.035*d,r=oe(ze(this.aimYaw-this.yaw),-1.2,1.2)}let o=this._pose||(this._pose={q:new an,wrist:0,twist:0,pitch:0});this.rightPose(o);let a=this.isRanged();e.torso.rotation.y=r+o.twist,e.torso.rotation.x=o.pitch-this.aimPitch*(a?.75:.3),e.neck.rotation.x=-this.aimPitch*.35,e.armR.quaternion.copy(o.q),e.wristR.rotation.x=o.wrist;let l=this.weapon,c=this.activeShield();if(this.shieldMesh){let h;c?this.action.s==="block"?h=Qc.block:h=this.horse?Qc.ride:Qc.idle:h=Qc.back;let d=e.shieldMount,u=Math.min(1,t*14);d.position.lerp(h.pos,u),d.rotation.y+=(h.rotY-d.rotation.y)*u,d.rotation.x+=(h.rotX-d.rotation.x)*u}l.cls==="bow"?e.armL.quaternion.copy(jc.bow):l.cls==="crossbow"?e.armL.quaternion.copy(jc.xbow):c?(Di.copy(e.shieldMount.position).sub(Wm),ca([Di.x,Di.y,Di.z],[0,0,1],th),e.armL.quaternion.copy(th)):l.twoHanded||l.cls==="spear"?(Tu.set(0,-.6,0).applyQuaternion(o.q).add(lM),o.wrist&&Tu.addScaledVector(Di.set(0,0,.25).applyQuaternion(o.q),0),Di.copy(Tu).sub(Wm),ca([Di.x,Di.y,Di.z],[0,0,1],th),e.armL.quaternion.copy(th)):l.lance&&this.horse?e.armL.quaternion.copy(jc.lance):($m.copy(jc.free),e.armL.quaternion.copy($m))}headPos(t){return t.copy(this.pos),t.y+=this.horse?2.45:1.65,t}dispose(){let t=this.battle.scene;t.remove(this.rig.root),this.horse&&t.remove(this.horse.rig.root)}};var hM=["left","right","up","down"];function dM(s,t,e){return Math.atan2(t-s.pos.x,e-s.pos.z)}function uM(s,t){let e=t.ai;e.nextThink=s.time+.25+Math.random()*.2;let n=e.target;if(!n||!n.alive||Math.random()<.12){let d=null,u=1/0,f=s.nearby(t.pos.x,t.pos.z,40),p=f.length>1?f:s.agents;for(let g of p){if(!g.alive||!s.areEnemies(t,g))continue;let m=(g.pos.x-t.pos.x)**2+(g.pos.z-t.pos.z)**2;g===n&&(m*=.7),g.ai&&g.ai.attackers>2&&(m*=1.4),m<u&&(u=m,d=g)}if(!d&&p!==s.agents)for(let g of s.agents){if(!g.alive||!s.areEnemies(t,g))continue;let m=(g.pos.x-t.pos.x)**2+(g.pos.z-t.pos.z)**2;m<u&&(u=m,d=g)}n&&n.ai&&(n.ai.attackers=Math.max(0,(n.ai.attackers||1)-1)),e.target=d,d&&d.ai&&(d.ai.attackers=(d.ai.attackers||0)+1),n=d}if(!n||t.busy())return;let i=s.groupOf(t),r=Math.hypot(n.pos.x-t.pos.x,n.pos.z-t.pos.z),o=t.weapons.findIndex(d=>wt[d].slot==="ranged"&&(t.ammo[d]||0)>0&&t.canUseWeapon(wt[d])),a=t.weapons.findIndex(d=>wt[d].slot==="melee"),l=t.action.s;if(l!=="idle"&&l!=="recover")return;let c=t.horse?5:6.5,h=o>=0&&i.fire&&r>c&&r<150;h&&t.wi!==o?(wt[t.weapons[o]].cls!=="throw"||r<28)&&t.switchWeapon(o):(!h&&t.isRanged()&&a>=0&&(r<=c||!t.hasAmmo()||!i.fire)||t.isRanged()&&!t.hasAmmo()&&a>=0)&&t.switchWeapon(a)}function Xm(s,t){let e=s.groupOf(t);if(e.order==="follow"&&s.player&&s.player.alive){let n=s.player,i=t.slotIndex||0,r=Math.floor(i/6),o=i%6-2.5,a=n.yaw,l=3+r*1.8;return[n.pos.x-Math.sin(a)*l+Math.cos(a)*o*1.6,n.pos.z-Math.cos(a)*l-Math.sin(a)*o*1.6,a]}return t.slot?[t.slot[0],t.slot[1],e.facing]:null}function qm(s,t,e){let n=t.ai;s.time>=n.nextThink&&uM(s,t),n.attackCd>0&&(n.attackCd-=e);let i=n.target&&n.target.alive?n.target:null,r=s.groupOf(t);t.move.x=0,t.move.z=0,t.move.walk=!1,t.ride.throttle=0,t.ride.turn=0;let o=i?Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z):1/0,a=!1;if(i)if(r.order==="charge")a=!0;else if(t.isRanged()&&r.fire)a=!0;else{let l=t.horse?16:r.engageR||7;a=o<l,a&&s.terrain.fort&&r.order==="hold"&&s.terrain.level(i.pos.x,i.pos.z)!==s.terrain.level(t.pos.x,t.pos.z)&&o>3&&(a=!1)}if(pM(s,t,i,o),(t.action.s==="draw"||t.action.s==="aim")&&(!r.fire||!i)&&t.setAction("idle"),i&&!t.horse&&t.isRanged()&&t.hasAmmo()&&r.fire&&r.order!=="charge"){let l=Xm(s,t);if(l&&Math.hypot(l[0]-t.pos.x,l[1]-t.pos.z)>2.5&&o>8){(t.action.s==="draw"||t.action.s==="aim")&&t.setAction("idle"),nh(s,t,l[0],l[1],l[2],!1);return}}if(!a){let l=Xm(s,t);if(l?nh(s,t,l[0],l[1],l[2],o<30):i&&r.order==="charge"?a=!0:fM(t,r),!a){i&&t.isRanged()&&r.fire&&Eu(s,t,i,o);return}}if(t.horse){t.isRanged()&&t.hasAmmo()?xM(s,t,i,o):yM(s,t,i,o);return}if(t.isRanged()&&t.hasAmmo()){let l=t.weapon.cls==="throw"?18:65;o>l&&r.order==="charge"?nh(s,t,i.pos.x,i.pos.z,null,!1):t.faceYaw=dM(t,i.pos.x,i.pos.z),Eu(s,t,i,o);return}gM(s,t,i,o)}function fM(s,t){t.facing!=null&&(s.faceYaw=t.facing),s.aimYaw=s.faceYaw}function nh(s,t,e,n,i,r){let o=s.terrain.waypoint(t.pos.x,t.pos.z,e,n);o&&(e=o[0],n=o[1]);let a=e-t.pos.x,l=n-t.pos.z,c=Math.hypot(a,l);if(t.horse){if(c<3)return t.ride.throttle=0,i!=null&&(t.ride.turn=oe(ze(i-t.horse.yaw)*2,-1,1)*.5),t.aimYaw=t.horse.yaw,!0;let u=Math.atan2(a,l),f=ze(u-t.horse.yaw);return t.ride.turn=oe(f*2.5,-1,1),t.ride.throttle=Math.abs(f)>1.4?.35:c<15?.4:.9,t.aimYaw=t.horse.yaw,ha(s,t,a/c,l/c),!1}if(c<.7)return t.faceYaw=i??t.faceYaw,t.aimYaw=t.faceYaw,!0;let h=a/c,d=l/c;return[h,d]=ha(s,t,h,d),t.move.x=h,t.move.z=d,t.move.walk=r&&c<6,t.faceYaw=Math.atan2(h,d),t.aimYaw=t.faceYaw,!1}function ha(s,t,e,n){let i=s.obstaclesNear(t.pos.x,t.pos.z,3.5),r=0,o=0;for(let a of i){let l=a.x-t.pos.x,c=a.z-t.pos.z,h=l*e+c*n;if(h<0||h>3.5)continue;let d=-l*n+c*e,u=a.r+t.radius+.4;if(Math.abs(d)<u){let f=d>0?-1:1;r+=-n*f,o+=e*f,t.horse&&(t.ride.turn=oe(t.ride.turn-f*.8,-1,1))}}if(r||o){e+=r*.9,n+=o*.9;let a=Math.hypot(e,n)||1;e/=a,n/=a}return[e,n]}function pM(s,t,e,n){let i=t.ai,r=s.time;if(t.horse&&!t.activeShield())return;let o=null,a=1/0,l=s.nearby(t.pos.x,t.pos.z,5);for(let c of l){if(!c.alive||!s.areEnemies(t,c))continue;let h=c.action.s;if(h!=="windup"&&h!=="hold"&&!(h==="swing"&&!c.action.hitDone)||!(c.isPlayer?Math.abs(ze(Math.atan2(t.pos.x-c.pos.x,t.pos.z-c.pos.z)-c.aimYaw))<.7:c.ai.target===t))continue;let u=Math.hypot(c.pos.x-t.pos.x,c.pos.z-t.pos.z)-c.weapon.reach;u>2.5||u<a&&(a=u,o=c)}if(o&&i.reacted!==o.action.id){i.reacted=o.action.id;let c=!!t.activeShield(),h=c?.35+t.blockSkill*.6:.2+t.blockSkill*.7;if(Math.random()<h&&!t.isRanged()){let d=c||Math.random()<t.blockSkill;i.blockDir=d?kr(o.action.dir):hM[Math.floor(Math.random()*4)],i.blockAt=r+t.reaction*(.6+Math.random()*.8),i.blockUntil=i.blockAt+.75+Math.random()*.3,i.blockFrom=o}}if(t.activeShield()&&e&&e.isRanged()&&n>8&&!t.horse&&Math.random()<.02&&(i.blockDir="up",i.blockAt=r,i.blockUntil=r+1.2,i.blockFrom=null),i.blockAt&&r>=i.blockAt&&r<i.blockUntil){let c=t.action.s;(c==="idle"||c==="recover"||(c==="windup"||c==="hold")&&Math.random()<t.blockSkill*.3)&&t.beginBlock(i.blockDir)}t.action.s==="block"&&r>=(i.blockUntil||0)&&(t.endBlock(),i.blockAt=0,i.attackCd=Math.min(i.attackCd,.1))}function mM(s,t){let e=s.weapon,n=e.dirs||["right"];if(t.action.s==="block"&&!t.activeShield()&&Math.random()<s.blockSkill){let i=n.filter(o=>kr(o)===t.action.blockDir),r=n.filter(o=>!i.includes(o));if(r.length)return r[Math.floor(Math.random()*r.length)]}return e.cls==="spear"&&n.includes("thrust")&&Math.random()<.75?"thrust":n[Math.floor(Math.random()*n.length)]}function gM(s,t,e,n){let i=t.ai,o=t.weapon.reach+.55+e.radius,a=Math.max(.9,o*(e.horse?.7:.78)),l=e.pos.x+e.vel.x*.25,c=e.pos.z+e.vel.z*.25;if(s.terrain.waypoint(t.pos.x,t.pos.z,l,c)&&n>3){nh(s,t,l,c,null,!1);return}let d=l-t.pos.x,u=c-t.pos.z,f=Math.hypot(d,u)||1,p=d/f,g=u/f;if(n>a+.35){let[x,M]=ha(s,t,p,g);t.move.x=x,t.move.z=M}else n<a-.6?(t.move.x=-p*.5,t.move.z=-g*.5):(i.strafeT-=1/60,i.strafeT<=0&&(i.strafe=Math.random()<.5?-1:Math.random()<.5?1:0,i.strafeT=.6+Math.random()*1.2),t.move.x=-g*i.strafe*.3,t.move.z=p*i.strafe*.3);let m=Math.atan2(p,g);t.faceYaw=m,t.aimYaw=m;let y=Math.abs(ze(m-t.yaw))<.5;t.action.s==="idle"&&i.attackCd<=0&&n<=o+.15&&y&&t.beginAttack(mM(t,e))&&(t.action.holdFor=.05+Math.random()*(.5-t.blockSkill*.3),i.attackCd=(.35+Math.random()*1.1)*(1.25-t.blockSkill*.5))}function yM(s,t,e,n){let i=t.ai,r=t.horse,o=t.weapon,a=s.time,l=Math.min(1.2,n/12),c=e.pos.x+e.vel.x*l,h=e.pos.z+e.vel.z*l,d=c-t.pos.x,u=h-t.pos.z,f=Math.hypot(d,u)||1,p=ze(Math.atan2(d,u)-r.yaw);if(i.passUntil&&a<i.passUntil)t.ride.throttle=1,t.ride.turn=0;else{Math.abs(p)>1.8&&n<9&&(i.passUntil=a+1.1);let y=c,x=h;if(!o.lance){let T=-u/f,C=d/f;y+=T*1.4,x+=C*1.4}let M=s.terrain.waypoint(t.pos.x,t.pos.z,y,x);M&&(y=M[0],x=M[1]);let v=Math.atan2(y-t.pos.x,x-t.pos.z),S=ze(v-r.yaw);t.ride.turn=oe(S*2.8,-1,1),t.ride.throttle=Math.abs(S)>1.6&&n<12?.5:1,ha(s,t,Math.sin(r.yaw),Math.cos(r.yaw))}if(Math.abs(r.speed)<.5&&i.stuckT==null&&(i.stuckT=a),Math.abs(r.speed)>1.5&&(i.stuckT=null),i.stuckT!=null&&a-i.stuckT>1.5&&(t.ride.throttle=-1,t.ride.turn=1,a-i.stuckT>2.5&&(i.stuckT=null)),t.aimYaw=Math.atan2(e.pos.x-t.pos.x,e.pos.z-t.pos.z),o.lance)return;let g=o.reach+1.1+e.radius,m=t.action.s;if(m==="idle"&&n<11&&Math.abs(p)<1&&i.attackCd<=0){let y=ze(t.aimYaw-r.yaw),x=y>.25?"left":y<-.25?"right":Math.random()<.5?"overhead":"right";t.beginAttack(x)&&(t.action.holdFor=99,i.attackCd=.8)}(m==="hold"||m==="windup")&&n<g&&(m==="hold"?t.toSwing():t.action.release=!0),m==="hold"&&n>16&&t.setAction("idle")}function xM(s,t,e,n){let i=t.horse,r=Math.atan2(e.pos.x-t.pos.x,e.pos.z-t.pos.z),o;n<18?o=r+Math.PI*.8*(t.ai.strafe||1):n>42?o=r:o=r+Math.PI/2*(t.ai.strafe||1);let a=s.terrain.waypoint(t.pos.x,t.pos.z,e.pos.x,e.pos.z);a&&(o=Math.atan2(a[0]-t.pos.x,a[1]-t.pos.z));let l=s.terrain.half-18;(Math.abs(t.pos.x)>l||Math.abs(t.pos.z)>l)&&(o=Math.atan2(-t.pos.x,-t.pos.z));let c=ze(o-i.yaw);t.ride.turn=oe(c*2.2,-1,1),t.ride.throttle=.8,ha(s,t,Math.sin(i.yaw),Math.cos(i.yaw)),t.aimYaw=r,Math.abs(ze(r-i.yaw))<2.3?Eu(s,t,e,n):t.action.s==="aim"&&t.action.t>1.5&&t.setAction("idle")}function Eu(s,t,e,n){let i=t.weapon;if(!t.hasAmmo()||!t.canUseWeapon(i))return;t.aimYaw=Math.atan2(e.pos.x-t.pos.x,e.pos.z-t.pos.z),t.horse||(t.faceYaw=t.aimYaw);let r=t.action.s,o=i.cls==="throw"?30:i.cls==="crossbow"?140:120;if(n>o)return;let a=s.aimSolution(t,e,i.projSpeed);if(t.aimPitch=a?Math.asin(oe(a.y,-1,1)):0,r==="idle")(i.cls!=="crossbow"||t.loaded)&&t.beginDraw(),t.ai.aimTime=.25+Math.random()*.5+t.aimErr*5;else if(r==="aim"&&t.action.t>=(t.action.ready||0)+(t.ai.aimTime||.4)){if(!a){t.setAction("idle");return}let l=t.spread()*(1+n/120),c=Math.atan2(a.x,a.z)+(Math.random()-.5)*2*l,h=Math.asin(oe(a.y,-1,1))+(Math.random()-.5)*2*l,d=Math.cos(h);t.shoot({x:Math.sin(c)*d,y:Math.sin(h),z:Math.cos(c)*d}),t.ai.attackCd=.3+Math.random()*.6}}var vM=9.8,_M=160;function MM(s){if(s==="javelin")return Ur("javelin");if(s==="throwaxe")return Ur("throwaxe");let t=new be,e=[],n=[],i=[],r=s==="bolt"?.45:.8,o=(a,l,c,h,d)=>{let u=new nn(a,l,c).toNonIndexed();u.translate(0,0,h);let f=new St(d),p=u.attributes.position.array,g=u.attributes.normal.array;for(let m=0;m<p.length;m++)e.push(p[m]),n.push(g[m]);for(let m=0;m<p.length/3;m++)i.push(f.r,f.g,f.b)};return o(.02,.02,r,-r/2+.05,"#8a6a3a"),o(.035,.035,.08,.06,"#555"),o(.005,.06,.12,-r+.12,"#eee"),o(.06,.005,.12,-r+.12,"#eee"),t.setAttribute("position",new Kt(e,3)),t.setAttribute("normal",new Kt(n,3)),t.setAttribute("color",new Kt(i,3)),t}var Au={};function wM(s){return Au[s]||(Au[s]=MM(s))}function Ym(s,t,e,n){let i=t.x-s.x,r=t.y-s.y,o=t.z-s.z,a=n.x-e.x,l=n.y-e.y,c=n.z-e.z,h=s.x-e.x,d=s.y-e.y,u=s.z-e.z,f=i*i+r*r+o*o,p=a*a+l*l+c*c,g=a*h+l*d+c*u,m,y,x=i*h+r*d+o*u,M=i*a+r*l+o*c,v=f*p-M*M;m=v>1e-9?Math.min(1,Math.max(0,(M*g-x*p)/v)):0,y=(M*m+g)/p,y<0?(y=0,m=Math.min(1,Math.max(0,-x/f))):y>1&&(y=1,m=Math.min(1,Math.max(0,(M-x)/f)));let S=s.x+i*m-(e.x+a*y),T=s.y+r*m-(e.y+l*y),C=s.z+o*m-(e.z+c*y);return[Math.sqrt(S*S+T*T+C*C),m,e.y+l*y]}var Or=new L,ih=new L,ls=new L,sh=class{constructor(t){this.battle=t,this.list=[],this.stuck=[]}spawn(t){let e=t.model==="javelin"?"javelin":t.model==="throwaxe"?"throwaxe":t.model==="crossbow"?"bolt":"arrow",n=new ge(wM(e),Tm());n.castShadow=!1,this.battle.scene.add(n);let i={...t,kind:e,mesh:n,age:0,speed0:t.vel.length(),spin:e==="throwaxe"?0:null};i.fromFort=!!(t.owner&&this.battle.terrain.fort&&this.battle.terrain.level(t.owner.pos.x,t.owner.pos.z)===1),this.orient(i),this.list.push(i)}orient(t){t.mesh.position.copy(t.pos),Or.copy(t.pos).add(t.vel),t.mesh.lookAt(Or),t.spin!=null&&(t.spin+=.5,t.mesh.rotateX(t.spin))}update(t){let e=this.battle,n=e.terrain;for(let i=this.list.length-1;i>=0;i--){let r=this.list[i];r.age+=t,ls.copy(r.pos),r.vel.y-=vM*t,r.pos.addScaledVector(r.vel,t);let o=(r.pos.x+ls.x)/2,a=(r.pos.z+ls.z)/2,l=Math.hypot(r.pos.x-ls.x,r.pos.z-ls.z),c=e.nearby(o,a,l/2+2.2),h=null,d=2,u=!1,f=0;for(let m of c){if(!m.alive||m===r.owner||!e.areEnemies(r.owner,m)&&!r.anyTeam)continue;let y=m.horse?m.pos.y+1.55:m.pos.y+.1,x=y+(m.horse?1.05:1.75);Or.set(m.pos.x,y,m.pos.z),ih.set(m.pos.x,x,m.pos.z);let[M,v,S]=Ym(ls,r.pos,Or,ih);if(M<.3&&v<d&&(h=m,d=v,u=!1,f=S-y),m.horse){let T=m.pos.x+Math.sin(m.horse.yaw)*.2,C=m.pos.z+Math.cos(m.horse.yaw)*.2;Or.set(T-Math.sin(m.horse.yaw)*.7,m.pos.y+1.3,C-Math.cos(m.horse.yaw)*.7),ih.set(T+Math.sin(m.horse.yaw)*.9,m.pos.y+1.45,C+Math.cos(m.horse.yaw)*.9);let[_,A]=Ym(ls,r.pos,Or,ih);_<.45&&A<d&&(h=m,d=A,u=!0)}}if(h){r.pos.lerpVectors(ls,r.pos,d),this.onHit(r,h,u,f),this.remove(i);continue}let p=!1;for(let m of e.obstaclesNear(r.pos.x,r.pos.z,1.5))if(Math.hypot(m.x-r.pos.x,m.z-r.pos.z)<m.r&&r.pos.y-n.heightAt(m.x,m.z)<6){p=!0;break}!p&&!r.fromFort&&n.hitsWall(r.pos.x,r.pos.y,r.pos.z)&&(p=!0);let g=n.heightAt(r.pos.x,r.pos.z);if(p||r.pos.y<=g){r.pos.y<g&&(r.pos.y=g+.02),e.sound("arrowHit",r),!p&&Math.random()<.5&&e.fx.spawn("dust",r.pos.x,r.pos.y+.05,r.pos.z),this.stick(r),this.list.splice(i,1);continue}if(r.age>8||Math.abs(r.pos.x)>n.half+40||Math.abs(r.pos.z)>n.half+40){this.remove(i);continue}this.orient(r)}}onHit(t,e,n,i){let r=this.battle,o=e.activeShield();if(!n&&o){let u=Math.atan2(-t.vel.x,-t.vel.z),f=Math.abs((u-e.aimYaw+Math.PI*3)%(Math.PI*2)-Math.PI),p=e.action.s==="block";if(p&&f<1.35||!p&&f<.55&&Math.random()<.5){r.sound("wood",e),r.fx.spawn("wood",t.pos.x,t.pos.y,t.pos.z);return}}r.fx.spawn("blood",t.pos.x,t.pos.y,t.pos.z,t.vel.x*.02,t.vel.z*.02);let a=Math.min(1.2,t.vel.length()/Math.max(1,t.speed0)),l=t.dmg*(.5+a*.5)*(.9+Math.random()*.2);if(n){let u=Os(l,t.dtype,e.horse.armor);r.onRangedHit(t.owner,e,u,!0),e.damageHorse(u,t.owner),r.sound("arrowHit",e);return}let c=i>1.45&&!e.horse?!0:e.horse&&i>.75,h=c?e.headArmor:e.bodyArmor,d=Os(l,t.dtype,h)*(c?1.6:1);r.onRangedHit(t.owner,e,d,!1,c),e.takeDamage(d,t.owner,t.dtype,{noStun:d<8}),r.sound("hit",e)}stick(t){if(t.mesh.position.copy(t.pos),this.stuck.push(t.mesh),this.stuck.length>_M){let e=this.stuck.shift();this.battle.scene.remove(e)}}remove(t){let e=this.list[t];this.battle.scene.remove(e.mesh),this.list.splice(t,1)}};var bM={inf:"\u041F\u0456\u0445\u043E\u0442\u0430",arch:"\u0421\u0442\u0440\u0456\u043B\u044C\u0446\u0456",cav:"\u041A\u0456\u043D\u043D\u043E\u0442\u0430"},SM={hold:"\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E",follow:"\u0437\u0430 \u043C\u043D\u043E\u044E",charge:"\u0432 \u0430\u0442\u0430\u043A\u0443"},rh=class{constructor(t,e){this.battle=t,this.root=b("div",{class:"bhud"}),e.append(this.root);let n=i=>b("div",{class:`dir ${i}`});this.dirs={left:n("left"),right:n("right"),up:n("up"),down:n("down")},this.inc={left:n("left"),right:n("right"),up:n("up"),down:n("down")},this.ring=b("div",{class:"ring"}),this.cross=b("div",{class:"crosshair"},b("div",{class:"dot"}),this.ring,...Object.values(this.dirs),b("div",{class:"incoming"},...Object.values(this.inc))),this.hpFill=b("div"),this.horseFill=b("div"),this.hpLabel=b("div",{class:"label"}),this.horseBar=b("div",{class:"hbar horse"},this.horseFill),this.horseLabel=b("div",{class:"label"}),this.bars=b("div",{class:"bars"},this.hpLabel,b("div",{class:"hbar"},this.hpFill),this.horseLabel,this.horseBar),this.weapons=b("div",{class:"weapons"}),this.counts=b("div",{class:"counts"}),this.mini=b("canvas",{class:"minimap",width:160,height:160}),this.mctx=this.mini.getContext("2d"),this.log=b("div",{class:"blog"}),this.orders=b("div",{class:"orders"}),this.center=b("div",{class:"center-msg"}),this.hint=b("div",{class:"hint",style:{display:"none"}}),this.flash=b("div",{class:"dmg-flash"}),this.root.append(this.flash,this.cross,this.bars,this.weapons,this.counts,this.mini,this.log,this.orders,this.center,this.hint),this.msgs=[],this.cache={},this.centerUntil=0}set(t,e,n){this.cache[e]!==n&&(this.cache[e]=n,t.innerHTML=n)}message(t,e="#f5ecd6"){let n=b("div",{style:{color:e}},t);for(this.log.append(n),this.msgs.push({el:n,t:performance.now()});this.msgs.length>7;)this.msgs.shift().el.remove()}centerMsg(t,e=2.5){this.center.textContent=t,this.centerUntil=performance.now()+e*1e3}showHint(t){if(!t){this.hint.style.display="none";return}this.hint.style.display="",this.set(this.hint,"hint",t)}damageFlash(){this.flash.style.boxShadow="inset 0 0 140px rgba(200,0,0,0.55)",clearTimeout(this.flashT),this.flashT=setTimeout(()=>{this.flash.style.boxShadow="inset 0 0 120px rgba(200,0,0,0)"},120)}update(){let t=this.battle,e=t.player,n=performance.now();for(let i of this.msgs)i.el.style.opacity=n-i.t>7e3?"0":"1";if(n>this.centerUntil&&(this.center.textContent=""),e&&e.alive){this.cross.style.display="",this.hpFill.style.width=`${Math.max(0,e.hp/e.maxHp*100)}%`,this.set(this.hpLabel,"hp",`\u0417\u0434\u043E\u0440\u043E\u0432'\u044F ${Math.max(0,Math.round(e.hp))} / ${e.maxHp}`),e.horse?(this.horseBar.style.display="",this.horseLabel.style.display="",this.horseFill.style.width=`${Math.max(0,e.horse.hp/e.horse.maxHp*100)}%`,this.set(this.horseLabel,"horse",`${e.horse.item.name} ${Math.round(e.horse.hp)} / ${e.horse.maxHp}${e.couched?' \xB7 <b style="color:#ffd66e">\u0421\u041F\u0418\u0421 \u041E\u041F\u0423\u0429\u0415\u041D\u041E</b>':""}`)):(this.horseBar.style.display="none",this.horseLabel.style.display="none");let i=e.weapons.map((h,d)=>{let u=wt[h],f=u.slot==="ranged"?` (${e.ammo[h]??0})`:"",p=e.canUseWeapon(u)?"":" \u26D4";return`<div class="w ${d===e.wi?"active":""}">${d+1}. ${u.name}${f}${p}</div>`});e.shield&&i.push(`<div class="w ${e.activeShield()?"active":""}">\u26E8 ${wt[e.shield].name}</div>`),this.set(this.weapons,"w",i.join(""));let r=e.isRanged(),o=t.input.attackDir,a={left:"left",right:"right",overhead:"up",thrust:"down"},l=r?null:e.action.s==="block"?e.action.blockDir:a[e.action.dir&&(e.action.s==="windup"||e.action.s==="hold"||e.action.s==="swing")?e.action.dir:o];for(let[h,d]of Object.entries(this.dirs))d.classList.toggle("on",h===l);for(let h of Object.values(this.dirs))h.style.display=r?"none":"";let c=t.incoming;for(let[h,d]of Object.entries(this.inc))d.classList.toggle("on",h===c);if(r){let h=Math.max(6,Math.min(80,e.spread()*900));this.ring.style.display="",this.ring.style.width=`${h*2}px`,this.ring.style.height=`${h*2}px`,this.ring.style.left=`${-h-2}px`,this.ring.style.top=`${-h-2}px`}else this.ring.style.display="none"}else this.cross.style.display="none",this.horseBar.style.display="none",this.horseLabel.style.display="none",this.hpFill.style.width="0%",this.set(this.hpLabel,"hp","\u0412\u0438 \u0431\u0435\u0437 \u0442\u044F\u043C\u0438");if(t.config.kind==="arena"){let i=t.agents.filter(r=>r.alive).length;this.set(this.counts,"c",`<div>\u041D\u0430 \u043D\u043E\u0433\u0430\u0445: <b>${i}</b></div><div>\u041F\u043E\u0432\u0430\u043B\u0435\u043D\u043E \u0432\u0430\u043C\u0438: <b>${t.playerKills.length}</b></div>`)}else{let i=t.teamCounts();this.set(this.counts,"c",`<div class="ally">${t.sideName(0)}: <b>${i[0].alive}</b>${i[0].reserve?` (+${i[0].reserve})`:""}</div><div class="enemy">${t.sideName(1)}: <b>${i[1].alive}</b>${i[1].reserve?` (+${i[1].reserve})`:""}</div>`)}if(t.config.kind!=="arena"){let i=t.input.selected,r=t.teams[0].groups,o=["inf","arch","cav"].map((a,l)=>`<span class="grp ${i.has(a)?"sel":""}">${l+1} ${bM[a]}: ${SM[r[a].order]}${a==="arch"&&!r[a].fire?" (\u043D\u0435 \u0441\u0442\u0440\u0456\u043B\u044F\u0442\u0438)":""}</span>`);this.set(this.orders,"o",`${o.join("")}<br><span style="opacity:.75">Z \u2014 \u0442\u0440\u0438\u043C\u0430\u0442\u0438 \xB7 X \u2014 \u0437\u0430 \u043C\u043D\u043E\u044E \xB7 C \u2014 \u0430\u0442\u0430\u043A\u0430 \xB7 V \u2014 \u0441\u0442\u0440\u0456\u043B\u044C\u0431\u0430 \xB7 Tab \u2014 \u0432\u0456\u0434\u0441\u0442\u0443\u043F \xB7 Esc \u2014 \u043F\u0430\u0443\u0437\u0430</span>`)}else this.set(this.orders,"o",`<span style="opacity:.75">\u0410\u0440\u0435\u043D\u0430: \u0431'\u044E\u0442\u044C\u0441\u044F \u0432\u0441\u0456 \u043F\u0440\u043E\u0442\u0438 \u0432\u0441\u0456\u0445. Tab \u2014 \u0432\u0438\u0439\u0442\u0438 \u0437 \u0430\u0440\u0435\u043D\u0438 \xB7 Esc \u2014 \u043F\u0430\u0443\u0437\u0430</span>`);this.drawMinimap()}drawMinimap(){let t=this.battle,e=this.mctx,n=160;e.clearRect(0,0,n,n);let i=t.player&&t.player.alive?t.player:t.camTarget,r=t.config.kind==="arena"?35:120,o=i?i.pos.x:0,a=i?i.pos.z:0,l=t.camYaw,c=n/2/r,h=Math.cos(l),d=Math.sin(l),u=(f,p)=>{let g=f-o,m=p-a,y=g*h-m*d,x=g*d+m*h;return[n/2-y*c,n/2-x*c]};if(t.terrain.fort){let f=t.terrain.fort;e.strokeStyle="rgba(200,200,200,0.6)",e.beginPath(),[[f.x0,f.z0],[f.x1,f.z0],[f.x1,f.z1],[f.x0,f.z1]].map(([g,m])=>u(g,m)).forEach(([g,m],y)=>y?e.lineTo(g,m):e.moveTo(g,m)),e.closePath(),e.stroke()}for(let f of t.agents){if(!f.alive)continue;let[p,g]=u(f.pos.x,f.pos.z);if(p<0||g<0||p>n||g>n)continue;e.fillStyle=f.isPlayer?"#fff":t.config.kind==="arena"?"#ffb070":f.team===0?"#6fb8ff":"#ff6a5a";let m=f.isPlayer?3.2:f.horse?2.4:1.8;e.fillRect(p-m,g-m,m*2,m*2)}}};var oh=class{constructor(t,e){this.battle=t,this.canvas=e,this.keys=new Set,this.lmb=!1,this.rmb=!1,this.accX=0,this.accY=0,this.attackDir="right",this.blockDir="up",this.selected=new Set(["inf","arch","cav"]),this.locked=!1,this.handlers=[];let n=(i,r,o,a)=>{i.addEventListener(r,o,a),this.handlers.push([i,r,o,a])};n(e,"click",()=>this.lock()),n(document,"pointerlockchange",()=>{this.locked=document.pointerLockElement===e,this.locked?t.onLock():(this.releaseButtons(),t.onUnlock())}),n(document,"mousemove",i=>{if(!this.locked)return;let r=t.settings.sensitivity||1,o=i.movementX||0,a=i.movementY||0;t.camYaw-=o*.0024*r,t.camPitch+=(t.settings.invertY?a:-a)*.0024*r,t.camPitch=Math.max(-1,Math.min(1.15,t.camPitch)),this.accX+=o,this.accY+=a,this.updateDir()}),n(document,"mousedown",i=>{this.locked&&(i.button===0?(this.lmb=!0,t.playerAttackPress()):i.button===2&&(this.rmb=!0,t.playerBlockPress()))}),n(document,"mouseup",i=>{i.button===0&&this.lmb?(this.lmb=!1,t.playerAttackRelease()):i.button===2&&this.rmb&&(this.rmb=!1,t.playerBlockRelease())}),n(document,"contextmenu",i=>i.preventDefault()),n(window,"wheel",i=>{this.locked&&t.playerNextWeapon(i.deltaY>0?1:-1)},{passive:!0}),n(window,"keydown",i=>{(i.code==="Tab"||i.code==="F1"||i.code==="F2"||i.code==="F3")&&i.preventDefault(),!i.repeat&&(this.keys.add(i.code),t.onKey(i.code))}),n(window,"keyup",i=>this.keys.delete(i.code)),n(window,"blur",()=>{this.keys.clear(),this.releaseButtons()})}releaseButtons(){this.lmb&&this.battle.playerAttackRelease(),this.rmb&&this.battle.playerBlockRelease(),this.lmb=!1,this.rmb=!1}lock(){if(!this.locked)try{let t=this.canvas.requestPointerLock();t&&t.catch&&t.catch(()=>{})}catch{}}unlock(){document.pointerLockElement&&document.exitPointerLock()}updateDir(){let t=this.accX,e=this.accY;Math.hypot(t,e)<4||(Math.abs(t)>Math.abs(e)?(this.attackDir=t>0?"right":"left",this.blockDir=t>0?"right":"left"):(this.attackDir=e<0?"overhead":"thrust",this.blockDir=e<0?"up":"down"))}decay(t){let e=Math.exp(-t*12);this.accX*=e,this.accY*=e}down(t){return this.keys.has(t)}dispose(){for(let[t,e,n,i]of this.handlers)t.removeEventListener(e,n,i);this.unlock()}};var da=600,TM={blood:{color:[.55,.04,.03],n:9,speed:2.2,up:1.2,life:.55,size:1},spark:{color:[1,.85,.45],n:10,speed:3.5,up:1.5,life:.28,size:.8},wood:{color:[.55,.38,.2],n:7,speed:2.2,up:1.2,life:.4,size:1},dust:{color:[.55,.5,.4],n:6,speed:1.2,up:1.4,life:.6,size:1.3}},ah=class{constructor(t){this.pos=new Float32Array(da*3),this.col=new Float32Array(da*3),this.vel=new Float32Array(da*3),this.life=new Float32Array(da),this.count=0,this.geo=new be,this.geo.setAttribute("position",new en(this.pos,3)),this.geo.setAttribute("color",new en(this.col,3)),this.geo.setDrawRange(0,0),this.mat=new xr({size:.09,vertexColors:!0,sizeAttenuation:!0,depthWrite:!1}),this.points=new wo(this.geo,this.mat),this.points.frustumCulled=!1,t.add(this.points)}spawn(t,e,n,i,r=0,o=0){let a=TM[t];if(a)for(let l=0;l<a.n;l++){this.count>=da&&this.kill(0);let c=this.count++;this.pos[c*3]=e+(Math.random()-.5)*.15,this.pos[c*3+1]=n+(Math.random()-.5)*.15,this.pos[c*3+2]=i+(Math.random()-.5)*.15;let h=a.speed*(.4+Math.random()*.8),d=Math.random()*Math.PI*2;this.vel[c*3]=Math.cos(d)*h*.6+r*h,this.vel[c*3+1]=a.up*(.3+Math.random()),this.vel[c*3+2]=Math.sin(d)*h*.6+o*h;let u=.8+Math.random()*.4;this.col[c*3]=a.color[0]*u,this.col[c*3+1]=a.color[1]*u,this.col[c*3+2]=a.color[2]*u,this.life[c]=a.life*(.6+Math.random()*.8)}}kill(t){let e=--this.count;if(t!==e){for(let n=0;n<3;n++)this.pos[t*3+n]=this.pos[e*3+n],this.vel[t*3+n]=this.vel[e*3+n],this.col[t*3+n]=this.col[e*3+n];this.life[t]=this.life[e]}}update(t){for(let e=this.count-1;e>=0;e--){if(this.life[e]-=t,this.life[e]<=0){this.kill(e);continue}this.vel[e*3+1]-=9.8*t,this.pos[e*3]+=this.vel[e*3]*t,this.pos[e*3+1]+=this.vel[e*3+1]*t,this.pos[e*3+2]+=this.vel[e*3+2]*t}this.geo.setDrawRange(0,this.count),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0}};var ua=class s extends ge{constructor(){let t=s.SkyShader,e=new Ie({name:t.name,uniforms:Sn.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:Je,depthWrite:!1});super(new nn(1,1,1),e),this.isSky=!0}};ua.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new L},cloudScale:{value:2e-4},cloudSpeed:{value:2e-5},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( vSunDirection.y );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// gradient at a lattice corner; sinless hash so every GPU produces the same clouds
		vec2 gradient( vec2 i ) {
			vec3 p = fract( i.xyx * vec3( 0.1031, 0.1030, 0.0973 ) );
			p += dot( p, p.yzx + 33.33 );
			return fract( ( p.xx + p.yz ) * p.zy ) * 2.0 - 1.0;
		}

		// 2D gradient noise: isotropic lobes like Perlin at value-noise cost
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 ); // quintic fade
			float a = dot( gradient( i ), f );
			float b = dot( gradient( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) );
			float c = dot( gradient( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) );
			float d = dot( gradient( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y ) * 1.6; // ~[-1,1]
		}

		// fbm; per-octave drift makes clouds billow instead of scrolling as a rigid stamp
		float fbm( vec2 p, float drift ) {
			float result = 0.0;
			float amplitude = 1.0;
			for ( int i = 0; i < 4; i ++ ) {
				result += amplitude * noise( p );
				amplitude *= 0.5;
				p = p * 2.0 + drift;
			}
			return result;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, direction.y ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - vSunDirection.y, 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = clamp( ( cosTheta - sunAngularDiameterCos ) * 50000.0, 0.0, 1.0 ) * showSunDisc;
			vec3 sundiscColor = ( 760.0 * sundisc ) * min( vSunE * Fex, 80.0 );

			vec3 texColor = ( Lin + L0 ) * 0.04 + sundiscColor + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Cloud density field
				float evolve = time * cloudSpeed * 300.0;
				float cloudNoise = clamp( fbm( cloudUV * 1000.0, evolve ) * 0.7 + 0.5, 0.0, 1.0 );

				// Large-scale coverage variation: clear gaps next to dense banks
				float region = noise( cloudUV * 300.0 ) * 0.37 + 0.5;
				float cov = clamp( cloudCoverage + ( region - 0.5 ) * 0.6, 0.0, 1.0 );

				// Carve clouds where noise rises above the coverage level
				float threshold = 1.0 - cov;
				float cloudMask = smoothstep( threshold, threshold + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.03 + 0.06 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting from the sky's own radiance
				float dayFactor = smoothstep( -0.08, 0.3, vSunDirection.y );
				vec3 sunColor = vSunE * Fex * 0.22 * 0.04; // 0.22 ~ albedo/pi, 0.04 = exposure; the aerial composite adds the eye-leg extinction
				vec3 skyAmbient = Lin * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

				// Beer-powder self-shadow from the sampled density
				float depth = max( 0.0, cloudNoise - threshold );
				float beer = exp( depth * -4.0 );
				float powder = 1.0 - beer * beer; // beer*beer == exp(-8*depth)
				float shade = mix( 0.45, 1.0, clamp( beer * powder * 2.6, 0.0, 1.0 ) ); // 2.6 = 1/0.385, normalizes beer*powder peak to 1

				// Henyey-Greenstein forward lobe ( g = 0.7 ): silver lining on rims toward the sun
				float silver = clamp( 0.51 / pow( 1.49 - cosTheta * 1.4, 1.5 ), 0.0, 3.0 ); // 0.51=1-g^2, 1.49=1+g^2, 1.4=2g
				float edge = cloudMask * ( 1.0 - cloudMask ) * 4.0;

				vec3 cloudColor = skyAmbient + sunColor * shade;
				cloudColor += sunColor * silver * edge * 0.6;
				cloudColor *= max( dayFactor, 0.03 );

				// Cloud opacity via Beer's law: density sets how solid the clouds get
				float alpha = ( 1.0 - exp( depth * cloudDensity * -12.0 ) ) * horizonFade;

				// Occlude the sun disc/glow behind opaque cloud
				texColor -= L0 * 0.04 * alpha;

				// Composite through the atmosphere so distant clouds dissolve into haze
				vec3 cloudAerial = mix( texColor, cloudColor, Fex );
				texColor = mix( texColor, cloudAerial, alpha );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var Br={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Nn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},EM=new Qi(-1,1,1,-1,0,1),Cu=class extends be{constructor(){super(),this.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Kt([0,2,0,0,2,0],2))}},AM=new Cu,cs=class{constructor(t){this._mesh=new ge(AM,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,EM)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var lh=class extends Nn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ie?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Sn.clone(t.uniforms),this.material=new Ie({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new cs(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var fa=class extends Nn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},ch=class extends Nn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var hh=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new ht);this._width=n.width,this._height=n.height,e=new Ge(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:sn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new lh(Br),this.copyPass.material.blending=We,this.timer=new Ho}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}fa!==void 0&&(o instanceof fa?n=!0:o instanceof ch&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new ht);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var dh=class extends Nn{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new St}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}};var pa={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ht},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new ce},cameraProjectionMatrixInverse:{value:new ce},cameraWorldMatrix:{value:new ce},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new L(-1,-1,-1)},sceneBoxMax:{value:new L(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},ma={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},uh={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Zm(s=5){let t=Math.floor(s)%2===0?Math.floor(s)+1:Math.floor(s),e=CM(t),n=e.length,i=new Uint8Array(n*4);for(let o=0;o<n;++o){let a=e[o],l=2*Math.PI*a/n,c=new L(Math.cos(l),Math.sin(l),0).normalize();i[o*4]=(c.x*.5+.5)*255,i[o*4+1]=(c.y*.5+.5)*255,i[o*4+2]=127,i[o*4+3]=255}let r=new Ai(i,t,t);return r.wrapS=Pn,r.wrapT=Pn,r.needsUpdate=!0,r}function CM(s){let t=Math.floor(s)%2===0?Math.floor(s)+1:Math.floor(s),e=t*t,n=Array(e).fill(0),i=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(i===-1&&r===t?(r=t-2,i=0):(r===t&&(r=0),i<0&&(i=t-1)),n[i*t+r]!==0){r-=2,i++;continue}else n[i*t+r]=o++;r++,i--}return n}var ga={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Ru(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new ht},cameraProjectionMatrixInverse:{value:new ce},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Ru(s,t,e){let n=RM(s,t,e),i="vec3[SAMPLES](";for(let r=0;r<s;r++){let o=n[r];i+=`vec3(${o.x}, ${o.y}, ${o.z})${r<s-1?",":")"}`}return i}function RM(s,t,e){let n=[];for(let i=0;i<s;i++){let r=2*Math.PI*t*i/s,o=Math.pow(i/(s-1),e);n.push(new L(Math.cos(r),Math.sin(r),o))}return n}var fh=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,i,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,d=(l+c)*h,u=l-d,f=c-d,p=t-u,g=e-f,m,y;p>g?(m=1,y=0):(m=0,y=1);let x=p-m+h,M=g-y+h,v=p-1+2*h,S=g-1+2*h,T=l&255,C=c&255,_=this.perm[T+this.perm[C]]%12,A=this.perm[T+m+this.perm[C+y]]%12,R=this.perm[T+1+this.perm[C+1]]%12,I=.5-p*p-g*g;I<0?n=0:(I*=I,n=I*I*this._dot(this.grad3[_],p,g));let D=.5-x*x-M*M;D<0?i=0:(D*=D,i=D*D*this._dot(this.grad3[A],x,M));let O=.5-v*v-S*S;return O<0?r=0:(O*=O,r=O*O*this._dot(this.grad3[R],v,S)),70*(n+i+r)}noise3d(t,e,n){let i,r,o,a,c=(t+e+n)*.3333333333333333,h=Math.floor(t+c),d=Math.floor(e+c),u=Math.floor(n+c),f=1/6,p=(h+d+u)*f,g=h-p,m=d-p,y=u-p,x=t-g,M=e-m,v=n-y,S,T,C,_,A,R;x>=M?M>=v?(S=1,T=0,C=0,_=1,A=1,R=0):x>=v?(S=1,T=0,C=0,_=1,A=0,R=1):(S=0,T=0,C=1,_=1,A=0,R=1):M<v?(S=0,T=0,C=1,_=0,A=1,R=1):x<v?(S=0,T=1,C=0,_=0,A=1,R=1):(S=0,T=1,C=0,_=1,A=1,R=0);let I=x-S+f,D=M-T+f,O=v-C+f,N=x-_+2*f,z=M-A+2*f,q=v-R+2*f,$=x-1+3*f,it=M-1+3*f,W=v-1+3*f,j=h&255,Q=d&255,Rt=u&255,At=this.perm[j+this.perm[Q+this.perm[Rt]]]%12,he=this.perm[j+S+this.perm[Q+T+this.perm[Rt+C]]]%12,Qt=this.perm[j+_+this.perm[Q+A+this.perm[Rt+R]]]%12,ie=this.perm[j+1+this.perm[Q+1+this.perm[Rt+1]]]%12,Y=.6-x*x-M*M-v*v;Y<0?i=0:(Y*=Y,i=Y*Y*this._dot3(this.grad3[At],x,M,v));let J=.6-I*I-D*D-O*O;J<0?r=0:(J*=J,r=J*J*this._dot3(this.grad3[he],I,D,O));let ut=.6-N*N-z*z-q*q;ut<0?o=0:(ut*=ut,o=ut*ut*this._dot3(this.grad3[Qt],N,z,q));let Ft=.6-$*$-it*it-W*W;return Ft<0?a=0:(Ft*=Ft,a=Ft*Ft*this._dot3(this.grad3[ie],$,it,W)),32*(i+r+o+a)}noise4d(t,e,n,i){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,d,u,f,p,g=(t+e+n+i)*l,m=Math.floor(t+g),y=Math.floor(e+g),x=Math.floor(n+g),M=Math.floor(i+g),v=(m+y+x+M)*c,S=m-v,T=y-v,C=x-v,_=M-v,A=t-S,R=e-T,I=n-C,D=i-_,O=A>R?32:0,N=A>I?16:0,z=R>I?8:0,q=A>D?4:0,$=R>D?2:0,it=I>D?1:0,W=O+N+z+q+$+it,j=o[W][0]>=3?1:0,Q=o[W][1]>=3?1:0,Rt=o[W][2]>=3?1:0,At=o[W][3]>=3?1:0,he=o[W][0]>=2?1:0,Qt=o[W][1]>=2?1:0,ie=o[W][2]>=2?1:0,Y=o[W][3]>=2?1:0,J=o[W][0]>=1?1:0,ut=o[W][1]>=1?1:0,Ft=o[W][2]>=1?1:0,Tt=o[W][3]>=1?1:0,Wt=A-j+c,pe=R-Q+c,et=I-Rt+c,rt=D-At+c,ot=A-he+2*c,at=R-Qt+2*c,dt=I-ie+2*c,Vt=D-Y+2*c,Ot=A-J+3*c,$t=R-ut+3*c,Yt=I-Ft+3*c,U=D-Tt+3*c,ue=A-1+4*c,te=R-1+4*c,P=I-1+4*c,w=D-1+4*c,B=m&255,H=y&255,Z=x&255,ct=M&255,ft=a[B+a[H+a[Z+a[ct]]]]%32,K=a[B+j+a[H+Q+a[Z+Rt+a[ct+At]]]]%32,nt=a[B+he+a[H+Qt+a[Z+ie+a[ct+Y]]]]%32,gt=a[B+J+a[H+ut+a[Z+Ft+a[ct+Tt]]]]%32,Ut=a[B+1+a[H+1+a[Z+1+a[ct+1]]]]%32,mt=.6-A*A-R*R-I*I-D*D;mt<0?h=0:(mt*=mt,h=mt*mt*this._dot4(r[ft],A,R,I,D));let pt=.6-Wt*Wt-pe*pe-et*et-rt*rt;pt<0?d=0:(pt*=pt,d=pt*pt*this._dot4(r[K],Wt,pe,et,rt));let It=.6-ot*ot-at*at-dt*dt-Vt*Vt;It<0?u=0:(It*=It,u=It*It*this._dot4(r[nt],ot,at,dt,Vt));let Bt=.6-Ot*Ot-$t*$t-Yt*Yt-U*U;Bt<0?f=0:(Bt*=Bt,f=Bt*Bt*this._dot4(r[gt],Ot,$t,Yt,U));let Zt=.6-ue*ue-te*te-P*P-w*w;return Zt<0?p=0:(Zt*=Zt,p=Zt*Zt*this._dot4(r[Ut],ue,te,P,w)),27*(h+d+u+f+p)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,i){return t[0]*e+t[1]*n+t[2]*i}_dot4(t,e,n,i,r){return t[0]*e+t[1]*n+t[2]*i+t[3]*r}};var zr=class s extends Nn{constructor(t,e,n=512,i=512,r,o,a){super(),this.width=n,this.height=i,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Zm(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Ge(this.width,this.height,{type:sn,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Ie({defines:Object.assign({},pa.defines),uniforms:Sn.clone(pa.uniforms),vertexShader:pa.vertexShader,fragmentShader:pa.fragmentShader,blending:We,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Uo,this.normalMaterial.blending=We,this.pdMaterial=new Ie({defines:Object.assign({},ga.defines),uniforms:Sn.clone(ga.uniforms),vertexShader:ga.vertexShader,fragmentShader:ga.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Ie({defines:Object.assign({},ma.defines),uniforms:Sn.clone(ma.uniforms),vertexShader:ma.vertexShader,fragmentShader:ma.fragmentShader,blending:We}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Ie({uniforms:Sn.clone(Br.uniforms),vertexShader:Br.vertexShader,fragmentShader:Br.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Go,blendDst:Ps,blendEquation:Bn,blendSrcAlpha:Vo,blendDstAlpha:Ps,blendEquationAlpha:Bn}),this.blendMaterial=new Ie({uniforms:Sn.clone(uh.uniforms),vertexShader:uh.vertexShader,fragmentShader:uh.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Yl,blendSrc:Go,blendDst:Ps,blendEquation:Bn,blendSrcAlpha:Vo,blendDstAlpha:Ps,blendEquationAlpha:Bn}),this._fsQuad=new cs(null),this._originalClearColor=new St,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new di,this.depthTexture.format=ui,this.depthTexture.type=is,this.normalRenderTarget=new Ge(this.width,this.height,{minFilter:Ve,magFilter:Ve,type:sn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,i=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=i,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Ru(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case s.OUTPUT.Off:break;case s.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=We,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case s.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=We,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case s.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=We,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case s.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case s.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=We,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case s.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=We,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,n,i,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i!=null&&(t.setClearColor(i),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,n,i,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,i=e.clearColor||i,r=e.clearAlpha||r,i!=null&&(t.setClearColor(i),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new fh,n=t*t*4,i=new Uint8Array(n);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let l=o,c=a;i[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,i[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,i[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,i[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}let r=new Ai(i,t,t,bn,pn);return r.wrapS=Pn,r.wrapT=Pn,r.needsUpdate=!0,r}};zr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var ya={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var ph=class extends Nn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Sn.clone(ya.uniforms),this.material=new Sr({name:ya.name,uniforms:this.uniforms,vertexShader:ya.vertexShader,fragmentShader:ya.fragmentShader}),this._fsQuad=new cs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},se.getTransfer(this._outputColorSpace)===ye&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Wo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===$o?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Xo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Is?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Yo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Zo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===qo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Km={low:{name:"\u041D\u0438\u0437\u044C\u043A\u0430",standard:!1,sky:!1,post:!1,ao:!1,grass:0,shadowSize:1024,shadows:!1,msaa:0},medium:{name:"\u0421\u0435\u0440\u0435\u0434\u043D\u044F",standard:!0,sky:!0,post:!1,ao:!1,grass:9e3,shadowSize:2048,shadows:!0,msaa:4},high:{name:"\u0412\u0438\u0441\u043E\u043A\u0430",standard:!0,sky:!0,post:!0,ao:!0,grass:22e3,shadowSize:4096,shadows:!0,msaa:4}};function Jm(s){return Km[s.graphics]||Km.medium}function PM(s){return s<5||s>=21?{night:!0,elev:.75,sunCol:"#a8bcff",sunI:.75,hemiI:.35,envI:1,exposure:1.3,dome:["#101d40","#2a3960"]}:s<7.5||s>=18.5?{night:!1,elev:.09,sunCol:"#ffb77a",sunI:2.6,hemiI:.45,envI:.75,exposure:.9,dome:["#4a5f95","#e6a67c"]}:{night:!1,elev:.35+(1-Math.abs(s-13)/6)*.55,sunCol:"#fff1dc",sunI:3,hemiI:.55,envI:.8,exposure:.85,dome:["#5b8fd0","#d4e2ec"]}}var mh=class{constructor(t,e){this.battle=t;let n=t.scene,i=t.renderer,r=t.gfx,o=t.terrain.pal,a=PM(e);this.night=a.night;let l=.6+e/24*Math.PI;this.sunDir=new L(Math.cos(l)*Math.cos(a.elev),Math.sin(a.elev),Math.sin(l)*Math.cos(a.elev)).normalize(),i.toneMapping=Is,i.toneMappingExposure=r.standard?a.exposure:1;let c=new Oo(a.night?"#35456e":"#bcd4f0",a.night?"#101418":o.grass,r.standard?a.hemiI*.25:a.hemiI*2.4);n.add(c);let h=new zo(a.sunCol,r.standard?a.sunI:a.sunI*.75);h.castShadow=r.shadows&&t.settings.shadows!==!1,h.shadow.mapSize.set(r.shadowSize,r.shadowSize);let d=h.shadow.camera;d.left=-45,d.right=45,d.top=45,d.bottom=-45,d.near=1,d.far=320,h.shadow.bias=-4e-4,h.shadow.normalBias=.04,n.add(h,h.target),this.sun=h;let u;if(a.night)u="#1a2340",this.sky=Pu("#070d22","#26345a");else if(r.sky){let p=new ua;p.scale.setScalar(1e3);let g=p.material.uniforms;g.turbidity.value=t.terrain.type==="steppe"||t.terrain.type==="desert"?8:5,g.rayleigh.value=a.elev<.2?2.4:1.4,g.mieCoefficient.value=.004,g.mieDirectionalG.value=.82,g.sunPosition.value.copy(this.sunDir).multiplyScalar(1e3),this.sky=p,u=a.elev<.2?"#d3a88c":o.fog}else u=a.elev<.2?"#c8a088":o.fog,this.sky=Pu(a.elev<.2?"#5a6aa0":o.sky[0],a.elev<.2?"#f0a870":o.sky[1]);n.add(this.sky),n.background=new St(u);let f=t.config.kind==="arena"?260:460;if(n.fog=r.standard?new po(u,a.night?.009:.0042):new mo(u,70,f),r.standard){let p=new Dr(i),g=new ws,m=new St(a.night?"#0c1016":o.grass).multiplyScalar(.55),y=Pu(a.dome[0],a.dome[1],m,this.sunDir,new St(a.sunCol).multiplyScalar(a.night?.2:1.6));g.add(y);let x=p.fromScene(g,.04,.1,2e3);n.environment=x.texture,n.environmentIntensity=a.envI,this.envRT=x,p.dispose(),y.geometry.dispose(),y.material.dispose()}}follow(t,e){let n=this.sunDir;this.sun.position.set(t.x+n.x*150,t.y+n.y*150,t.z+n.z*150),this.sun.target.position.copy(t),this.sky.position.copy(e.position)}dispose(){this.envRT&&this.envRT.dispose(),this.sky&&(this.sky.geometry.dispose(),this.sky.material.dispose())}};function Pu(s,t,e=null,n=null,i=null){let r=new Pi(900,32,16),o=new Ie({side:Je,depthWrite:!1,fog:!1,uniforms:{top:{value:new St(s)},horizon:{value:new St(t)},ground:{value:new St(e||t)},sunDir:{value:n?n.clone():new L(0,1,0)},sunCol:{value:i?new St(i):new St(0,0,0)},hasGround:{value:e?1:0}},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; uniform vec3 sunDir; uniform vec3 sunCol; uniform float hasGround; varying vec3 vP;
      void main(){
        vec3 d = normalize(vP);
        vec3 c = mix(horizon, top, pow(clamp(d.y * 1.4 + 0.05, 0.0, 1.0), 0.7));
        if (hasGround > 0.5) c = mix(c, ground, smoothstep(0.0, -0.08, d.y));
        float s = max(dot(d, sunDir), 0.0);
        c += sunCol * (pow(s, 8.0) * 0.5 + pow(s, 64.0) * 2.0);
        gl_FragColor = vec4(c, 1.0);
      }`});return new ge(r,o)}var gh=class{constructor(t,e,n,i){let r=window.innerWidth,o=window.innerHeight,a=t.getPixelRatio(),l=new Ge(Math.floor(r*a),Math.floor(o*a),{type:sn,samples:i.msaa});if(this.composer=new hh(t,l),this.composer.addPass(new dh(e,n)),i.ao){let c=new zr(e,n,r,o);c.output=zr.OUTPUT.Default,c.blendIntensity=.85,c.updateGtaoMaterial({radius:.9,distanceExponent:1.4,thickness:1.2,scale:1.1,samples:12}),c.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,rings:2,samples:12}),this.composer.addPass(c),this.ao=c}this.composer.addPass(new ph)}render(){this.composer.render()}resize(t,e){this.composer.setSize(t,e)}dispose(){this.composer.dispose(),this.ao&&this.ao.dispose()}};var IM={inf:"inf",arch:"arch",cav:"cav",harch:"cav"},LM={left:"left",right:"right",up:"up",down:"down"},jm=[{weapons:["train_sword"],shield:"shield_wood",armor:"padded",helmet:"leather_cap"},{weapons:["train_greatsword"],shield:null,armor:"padded",helmet:"nasal"},{weapons:["train_spear"],shield:"shield_round",armor:"leather",helmet:null},{weapons:["train_sword"],shield:"shield_kite",armor:"gambeson",helmet:"kettle"}];function DM(s,t){return Xu(s,t)}function Qm(s){return s.startsWith("#")?s:`#${s.match(/\d+/g).map(Number).map(e=>e.toString(16).padStart(2,"0")).join("")}`}var yh=class{constructor(t,e,n,i){this.game=t,this.root=e,this.config=n,this.onFinish=i,this.settings=t.settings,this.time=0,this.attackSeq=1,this.agents=[],this.corpses=[],this.looseHorses=[],this.deadHorses=[],this.playerKills=[],this.playerDown=!1,this.ended=!1,this.paused=!0,this.started=!1,this.victoryAt=0,this.incoming=null,this.camYaw=0,this.camPitch=.12,this.camTarget=null,this.teamAiT=0,this.extraLosses=[new Map,new Map],this.gfx=Jm(this.settings),Sm(this.gfx.standard);try{this.setupRenderer(),this.fx=new ah(this.scene),this.terrain=new Zc(n.kind,n.terrain),this.terrain.build(this.scene,this.gfx),this.buildObstacleGrid(),this.setupLights(n.hour??12),this.projectiles=new sh(this),this.hud=new rh(this,e),this.input=new oh(this,this.renderer.domElement),this.setupTeams(),this.spawnInitial(),this.showStartOverlay()}catch(r){throw this.input&&this.input.dispose(),this.renderer&&this.renderer.dispose(),e.innerHTML="",r}this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),window.__battle=this}setupRenderer(){let t=new Hc({antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)*(this.settings.quality||1)),t.setSize(window.innerWidth,window.innerHeight),t.shadowMap.enabled=this.gfx.shadows&&this.settings.shadows!==!1,t.shadowMap.type=Rs,this.root.append(t.domElement),this.renderer=t,this.scene=new ws,this.camera=new fn(64,window.innerWidth/window.innerHeight,.1,1500)}resize(){this.renderer.setSize(window.innerWidth,window.innerHeight),this.post&&this.post.resize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()}setupLights(t){this.env=new mh(this,t),this.sun=this.env.sun,this.sunDir=this.env.sunDir,this.sky=this.env.sky,this.gfx.post&&(this.post=new gh(this.renderer,this.scene,this.camera,this.gfx))}buildObstacleGrid(){this.obsGrid=new Map;for(let t of this.terrain.obstacles){let e=Math.floor((t.x-t.r)/6),n=Math.floor((t.x+t.r)/6),i=Math.floor((t.z-t.r)/6),r=Math.floor((t.z+t.r)/6);for(let o=e;o<=n;o++)for(let a=i;a<=r;a++){let l=o*10007+a,c=this.obsGrid.get(l);c||this.obsGrid.set(l,c=[]),c.push(t)}}this.grid=new Map}obstaclesNear(t,e,n){let i=[],r=Math.floor((t-n)/6),o=Math.floor((t+n)/6),a=Math.floor((e-n)/6),l=Math.floor((e+n)/6);for(let c=r;c<=o;c++)for(let h=a;h<=l;h++){let d=this.obsGrid.get(c*10007+h);if(d)for(let u of d)i.includes(u)||i.push(u)}return i}rebuildGrid(){for(let t of this.grid.values())t.length=0;for(let t of this.agents){if(!t.alive)continue;let e=Math.floor(t.pos.x/4)*10007+Math.floor(t.pos.z/4),n=this.grid.get(e);n||this.grid.set(e,n=[]),n.push(t)}}nearby(t,e,n){let i=[],r=Math.floor((t-n)/4),o=Math.floor((t+n)/4),a=Math.floor((e-n)/4),l=Math.floor((e+n)/4);for(let c=r;c<=o;c++)for(let h=a;h<=l;h++){let d=this.grid.get(c*10007+h);if(d)for(let u of d)i.push(u)}return i}areEnemies(t,e){return!!t&&!!e&&t.team!==e.team}heroSkill(t){let e=this.config.sides[0].hero;return e&&e.skills[t]||0}sideName(t){let e=this.config.sides[t].name||"";return e.length>26?`${e.slice(0,24)}\u2026`:e}sound(t,e){let n=this.game.sfx,i=e&&e.pos?this.camera.position.distanceTo(e.pos):0;if(!(i>90))switch(t){case"swing":n.swing(i);break;case"clang":n.clang(i);break;case"wood":n.woodBlock(i);break;case"hit":n.hit(i);break;case"hitHeavy":n.hit(i,!0);break;case"bow":n.bowRelease(i);break;case"arrowHit":n.arrowHit(i);break;case"hoof":i<40&&n.hoof(i);break;case"grunt":n.grunt(i);break;default:}}setupTeams(){let t=this.config,e=t.kind==="siege",n=this.terrain.fort,i=(p,g)=>{let m=Math.sin(g),y=Math.cos(g),x=-Math.cos(g),M=Math.sin(g);return{inf:{order:"charge",pos:{x:p.x,z:p.z},facing:g,fire:!0,engageR:7},arch:{order:"hold",pos:{x:p.x-m*7,z:p.z-y*7},facing:g,fire:!0,engageR:6},cav:{order:"charge",pos:{x:p.x+x*26,z:p.z+M*26},facing:g,fire:!0,engageR:16}}},r=e?{x:0,z:48,yaw:Math.PI}:{x:0,z:66,yaw:Math.PI},o=e?{x:0,z:(n.z0+n.z1)/2,yaw:0}:{x:0,z:-66,yaw:0};if(this.teams=[{base:r,groups:i(r,r.yaw),reserve:[],all:[]},{base:o,groups:i(o,o.yaw),reserve:[],all:[]}],e){let p=this.teams[1].groups;p.inf.order="hold",p.inf.pos={x:n.rampX,z:n.z1-6},p.inf.engageR=9,p.arch.order="hold",p.arch.pos={x:0,z:n.z1-1.5},p.arch.width=Math.floor((n.x1-n.x0-4)/1.6),p.cav.order="hold",p.cav.pos={x:n.rampX,z:n.z1-11},p.cav.engageR=9;let g=this.teams[0].groups;g.arch.pos={x:0,z:14},g.arch.order="hold",g.cav.pos={x:18,z:52}}for(let p=0;p<2;p++){let g=t.sides[p],m=[];for(let y of g.units)for(let x=0;x<y.count;x++)m.push({key:y.key,troopId:y.troopId,status:"reserve",wounded:!1});p===1&&m.sort(()=>Math.random()-.5),this.teams[p].all=m,this.teams[p].reserve=[...m]}let a=this.teams[0].all.length+(t.sides[0].hero?1:0),l=this.teams[1].all.length,c=t.kind==="arena"?8:Math.max(10,this.settings.battleSize||60),h=a/Math.max(1,a+l),d=Math.round(c*oe(h,.2,.8)),u=c-d;d=Math.max(Math.min(a,5),Math.min(a,d)),u=Math.max(Math.min(l,5),Math.min(l,u)),this.teams[0].cap=d,this.teams[1].cap=u;let f=this.teams[1].all.filter(p=>Gt[p.troopId].type==="arch"||Gt[p.troopId].type==="harch").length/Math.max(1,l);!e&&t.kind==="field"&&f>.3&&(this.teams[1].groups.inf.order="hold",this.teams[1].holdUntil=40+Math.random()*20)}colorsFor(t){let e=Qm((this.config.factionColors||[])[t]||(t===0?"#3f6fb5":"#a8322a"));return{team:e,team2:Qm(DM(e,1.6))}}spawnInitial(){let t=this.config;if(t.kind==="arena"){this.spawnArena();return}let e=t.sides[0].hero,n=this.teams[0].base;if(e){let r=Math.sin(n.yaw),o=Math.cos(n.yaw),a=new as(this,{team:0,key:"player",hero:e,isPlayer:!0,x:n.x+r*5,z:n.z+o*5,yaw:n.yaw,colors:{team:this.colorsFor(0).team,team2:"#f5d76e"},noHorse:t.kind==="siege",name:e.name});this.player=a,this.agents.push(a),this.camYaw=n.yaw}this.companions=[];let i=t.sides[0].companions||[];i.forEach((r,o)=>{let a=r.equipment,l=a.w1&&wt[a.w1].slot==="ranged",c=a.horse&&t.kind!=="siege"?"cav":l?"arch":"inf",h=o%2?1:-1,d=new as(this,{team:0,key:r.key,hero:r,x:n.x+Math.cos(n.yaw)*h*(2+o),z:n.z-Math.sin(n.yaw)*h*(2+o),yaw:n.yaw,colors:{team:this.colorsFor(0).team,team2:"#f5d76e"},noHorse:t.kind==="siege",group:c,name:r.name,preferRanged:l});d.companionId=r.id,this.companions.push(d),this.agents.push(d)});for(let r=0;r<2;r++)this.spawnWave(r,this.teams[r].cap-(r===0&&e?1+i.length:0),!0);for(let r=0;r<2;r++)for(let o of["inf","arch","cav"])this.assignSlots(r,o);this.rebuildGrid();for(let r of this.agents)r.slot&&!r.isPlayer&&(r.pos.x=r.slot[0],r.pos.z=r.slot[1],r.pos.y=this.terrain.heightAt(r.pos.x,r.pos.z))}spawnWave(t,e,n=!1){let i=this.teams[t],o=this.config.kind==="siege",a=0;for(;a<e&&i.reserve.length;){let l=i.reserve.shift(),c=Gt[l.troopId],h=IM[c.type]||"inf",d=i.groups[h],u,f;if(n)u=d.pos.x+(Math.random()-.5)*10,f=d.pos.z+(Math.random()-.5)*6;else if(o&&t===1){let g=this.terrain.fort;u=(Math.random()-.5)*20,f=g.z0+14+Math.random()*6}else{let g=i.base;u=g.x+(Math.random()-.5)*30,f=g.z+(Math.random()-.5)*8-Math.cos(g.yaw)*6}let p=new as(this,{team:t,key:l.key,troopId:l.troopId,x:u,z:f,yaw:i.base.yaw,colors:this.colorsFor(t),noHorse:o,group:h,name:c.name});p.entry=l,l.status="field",l.agent=p,this.agents.push(p),a++}return a}spawnArena(){let t=this.config.sides[0].hero,n=(this.config.arenaFighters||7)+1,i=13;for(let r=0;r<n;r++){let o=r/n*Math.PI*2,a=Math.sin(o)*i,l=Math.cos(o)*i,c=Math.atan2(-a,-l),h=jm[Math.floor(Math.random()*jm.length)],d=`hsl(${Math.floor(r/n*360)},55%,45%)`,u=document.createElement("canvas").getContext("2d");u.fillStyle=d;let f=u.fillStyle;if(r===0){let p=new as(this,{team:0,key:"player",hero:t,isPlayer:!0,x:a,z:l,yaw:c,colors:{team:"#2f5aa0",team2:"#f5d76e"},noHorse:!0,loadout:{weapons:["train_sword"],shield:"shield_wood",armor:"padded",helmet:"leather_cap"},name:t.name});p.hp=p.maxHp,this.player=p,this.agents.push(p),this.camYaw=c}else{let p=new as(this,{team:r,key:`arena${r}`,x:a,z:l,yaw:c,colors:{team:f,team2:"#dddddd"},loadout:h,hp:55+Math.floor(Math.random()*25),name:["\u041A\u0443\u043B\u0430\u0447\u043D\u0438\u0439 \u0431\u043E\u0454\u0446\u044C","\u0413\u043B\u0430\u0434\u0456\u0430\u0442\u043E\u0440","\u0412\u0435\u0442\u0435\u0440\u0430\u043D \u0430\u0440\u0435\u043D\u0438","\u041D\u043E\u0432\u0430\u0447\u043E\u043A \u0430\u0440\u0435\u043D\u0438","\u0417\u0430\u0431\u0456\u044F\u043A\u0430"][Math.floor(Math.random()*5)]});p.group="inf",this.agents.push(p)}}for(let r of Object.values(this.teams[0].groups))r.order="charge";for(let r of Object.values(this.teams[1].groups))r.order="charge";this.rebuildGrid()}groupOf(t){let e=this.teams[Math.min(t.team,1)];return e.groups[t.group]||e.groups.inf}assignSlots(t,e){if(this.config.kind==="arena")return;let n=this.teams[t].groups[e],i=this.agents.filter(g=>g.alive&&g.team===t&&!g.isPlayer&&g.group===e),r=i.length;if(!r)return;let o=e==="cav"&&i.some(g=>g.horse),a=o?3.2:1.5,l=n.width||oe(Math.ceil(Math.sqrt(r*(o?2:5))),3,24),c=Math.sin(n.facing),h=Math.cos(n.facing),d=-Math.cos(n.facing),u=Math.sin(n.facing);i.sort((g,m)=>g.pos.x*d+g.pos.z*u-(m.pos.x*d+m.pos.z*u));let f=Math.ceil(r/l),p=0;for(let g=0;g<f;g++){let m=Math.min(l,r-g*l);i.slice(p,p+m).forEach((x,M)=>{let v=(M-(m-1)/2)*a,S=g*a*1.2;x.slot=[n.pos.x+d*v-c*S,n.pos.z+u*v-h*S],x.slotIndex=g*l+M}),p+=m}}teamCounts(){let t=[{alive:0,reserve:this.teams[0].reserve.length},{alive:0,reserve:this.teams[1].reserve.length}];for(let e of this.agents)e.alive&&t[Math.min(1,e.team)].alive++;return t}giveOrder(t){let e=this.player;if(!e||!e.alive||this.config.kind==="arena")return;let n=this.teams[0],i=[...this.input.selected],r=Math.sin(e.yaw),o=Math.cos(e.yaw);for(let l of i){let c=n.groups[l];if(t==="fire"){c.fire=!c.fire;continue}if(c.order=t,t==="hold"){let h=l==="arch"&&i.includes("inf")?-6:l==="cav"&&i.length>1?-14:0;c.pos={x:e.pos.x+r*(2+h),z:e.pos.z+o*(2+h)},c.facing=e.yaw}this.assignSlots(0,l)}let a={hold:"\u0422\u0440\u0438\u043C\u0430\u0442\u0438 \u043F\u043E\u0437\u0438\u0446\u0456\u044E!",follow:"\u0417\u0430 \u043C\u043D\u043E\u044E!",charge:"\u0412 \u0430\u0442\u0430\u043A\u0443!"};if(t==="fire"){let l=n.groups.arch.fire;this.hud.centerMsg(l?"\u0421\u0442\u0440\u0456\u043B\u044F\u0442\u0438 \u0437\u0430 \u0431\u0430\u0436\u0430\u043D\u043D\u044F\u043C!":"\u041D\u0435 \u0441\u0442\u0440\u0456\u043B\u044F\u0442\u0438!",1.5)}else this.hud.centerMsg(a[t],1.5);this.game.sfx.horn()}updateTeamAI(t){if(this.teamAiT-=t,this.teamAiT>0)return;this.teamAiT=1;let e=this.config;if(e.kind==="arena")return;let n=this.teams[1],i=n.groups;if(e.kind==="field"){if(i.inf.order==="hold"){let o=!1;for(let l of this.agents)if(!(!l.alive||l.team!==0)&&Math.hypot(l.pos.x-i.inf.pos.x,l.pos.z-i.inf.pos.z)<38){o=!0;break}let a=!this.agents.some(l=>l.alive&&l.team===1&&l.group==="arch"&&l.hasAmmo()&&l.isRanged());(o||this.time>(n.holdUntil||0)||a)&&(i.inf.order="charge")}i.arch.order==="hold"&&this.time>30&&(this.agents.some(a=>a.alive&&a.team===1&&a.group==="arch"&&Object.values(a.ammo).some(l=>l>0))||(i.arch.order="charge"))}if(this.playerDown)for(let o of Object.values(this.teams[0].groups))o.order="charge";if(Math.floor(this.time)%4===0)for(let o=0;o<2;o++)for(let a of["inf","arch","cav"])this.teams[o].groups[a].order==="hold"&&this.assignSlots(o,a);let r=this.teamCounts();for(let o=0;o<2;o++){let a=this.teams[o];if(!a.reserve.length)continue;let l=a.cap;if(r[o].alive<l*.55){let c=this.spawnWave(o,Math.ceil(l-r[o].alive));if(c>0){for(let h of["inf","arch","cav"])this.assignSlots(o,h);this.hud.message(o===0?`\u0414\u043E \u0432\u0430\u0441 \u043F\u0440\u0438\u0431\u0443\u043B\u043E \u043F\u0456\u0434\u043A\u0440\u0456\u043F\u043B\u0435\u043D\u043D\u044F: ${c}`:`\u0414\u043E \u0432\u043E\u0440\u043E\u0433\u0430 \u043F\u0440\u0438\u0431\u0443\u043B\u043E \u043F\u0456\u0434\u043A\u0440\u0456\u043F\u043B\u0435\u043D\u043D\u044F: ${c}`,o===0?"#9fd8ff":"#ffb0a0"),this.game.sfx.horn()}}}}resolveMelee(t){let e=t.weapon,n=t.action.dir,i=Gm(this,t,e,n);if(!i)return;let r=i.target;if(!i.horse&&Vm(t,r,n)){t.setAction("bounce",ni.bounce);let d=!!r.activeShield();if(this.sound(d?"wood":"clang",r),this.impactFx(d?"wood":"spark",r,t),!r.horse){let u=r.pos.x-t.pos.x,f=r.pos.z-t.pos.z,p=Math.hypot(u,f)||1;r.vel.x+=u/p*1.2,r.vel.z+=f/p*1.2}r.isPlayer&&this.hud.message("\u0423\u0434\u0430\u0440 \u0437\u0430\u0431\u043B\u043E\u043A\u043E\u0432\u0430\u043D\u043E","#cfe8ff"),t.isPlayer&&this.hud.message("\u0412\u0430\u0448 \u0443\u0434\u0430\u0440 \u0437\u0430\u0431\u043B\u043E\u043A\u043E\u0432\u0430\u043D\u043E","#ffd6a0");return}let[o,a]=Hm(e,n),l=bu(t,r),c=1+Math.min(.18,(t.action.holdT||0)*.3),h=o*t.power*l*c*(.9+Math.random()*.2);this.applyHit(t,r,h,a,i.horse,n==="overhead"||n==="thrust"&&Math.random()<.25,n)}impactFx(t,e,n,i=!1){let r=n?n.pos.x-e.pos.x:0,o=n?n.pos.z-e.pos.z:0,a=Math.hypot(r,o)||1,l=e.pos.y+(i?1.35:e.horse?2.2:1.3);this.fx.spawn(t,e.pos.x+r/a*.3,l,e.pos.z+o/a*.3,-r/a*.6,-o/a*.6)}applyHit(t,e,n,i,r,o,a){if(this.impactFx("blood",e,t,r&&!!e.horse),r&&e.horse){let p=Os(n*1.1,i,e.horse.armor);e.damageHorse(p,t),this.sound("hit",e),t.isPlayer&&this.hud.message(`\u041A\u043E\u043D\u044E \u0437\u0430\u0432\u0434\u0430\u043D\u043E ${Math.round(p)} \u0448\u043A\u043E\u0434\u0438`,"#ffe9b0");return}let l=o?e.headArmor:e.bodyArmor,c=Os(n,i,l)*(o?1.2:1),h=e.pos.x-t.pos.x,d=e.pos.z-t.pos.z,u=Math.hypot(h,d)||1,f=a==="thrust"||a==="overhead"?1.6:1.1;t.isPlayer&&this.hud.message(`\u0417\u0430\u0432\u0434\u0430\u043D\u043E ${Math.round(c)} \u0448\u043A\u043E\u0434\u0438${o?" (\u0432 \u0433\u043E\u043B\u043E\u0432\u0443)":""}`,"#ffe9b0"),e.isPlayer&&(this.hud.message(`\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${Math.round(c)} \u0448\u043A\u043E\u0434\u0438`,"#ff9a8a"),this.hud.damageFlash()),e.takeDamage(c,t,i,{push:[h/u*f,d/u*f]}),this.sound(c>20?"hitHeavy":"hit",e),e.alive&&Math.random()<.3&&this.sound("grunt",e)}resolveCouch(t){let e=t.weapon,n=e.reach+1.2,i=this.nearby(t.pos.x,t.pos.z,n+1.5),r=null,o=1/0;for(let h of i){if(h===t||!h.alive||!this.areEnemies(t,h))continue;let d=h.pos.x-t.pos.x,u=h.pos.z-t.pos.z,f=Math.hypot(d,u)-h.radius;f>n||Math.abs(ze(Math.atan2(d,u)-t.horse.yaw))>.32||f<o&&(o=f,r=h)}if(!r)return;let a=bu(t,r,!0),l=(e.thrust?e.thrust[0]:30)*t.power*a;r.activeShield()&&r.action.s==="block"&&(l*=.45,this.sound("wood",r));let c=!!r.horse&&Math.random()<.35;this.applyHit(t,r,l,"pierce",c,Math.random()<.2,"thrust"),t.couched=!1,t.couchCd=1.4,t.isPlayer&&this.hud.centerMsg("\u0423\u0434\u0430\u0440 \u0441\u043F\u0438\u0441\u043E\u043C!",1)}fireProjectile(t,e,n){let i=new L(t.pos.x,t.pos.y+(t.horse?2.35:1.5),t.pos.z);i.x+=Math.sin(t.aimYaw)*.45,i.z+=Math.cos(t.aimYaw)*.45;let r;if(n)r=new L(n.x,n.y,n.z).normalize();else{r=this.cameraAimPoint().sub(i).normalize();let l=t.spread(),c=Math.atan2(r.x,r.z)+(Math.random()-.5)*2*l,h=Math.asin(oe(r.y,-1,1))+(Math.random()-.5)*2*l;r.set(Math.sin(c)*Math.cos(h),Math.sin(h),Math.cos(c)*Math.cos(h))}let o=e.cls==="crossbow"?1:t.rpower;this.projectiles.spawn({owner:t,pos:i,vel:r.multiplyScalar(e.projSpeed),dmg:e.dmg*o,dtype:e.dtype,model:e.model}),this.sound("bow",t)}cameraAimPoint(){let t=this.camera,e=new L;t.getWorldDirection(e);let n=t.position.clone(),i=1.5;for(let r=3;r<220;r+=i){let o=n.x+e.x*r,a=n.y+e.y*r,l=n.z+e.z*r;if(a<=this.terrain.heightAt(o,l))return new L(o,a,l)}return n.addScaledVector(e,220)}aimSolution(t,e,n){let i=t.pos.x,r=t.pos.y+(t.horse?2.35:1.5),o=t.pos.z,a=e.pos.x,l=e.pos.z,c=e.pos.y+(e.horse?2:1.1),h=Math.hypot(a-i,l-o),d=h/n;a+=e.vel.x*d,l+=e.vel.z*d,h=Math.hypot(a-i,l-o);let u=c-r,f=9.8,p=n*n,g=p*p-f*(f*h*h+2*u*p);if(g<0)return null;let m=Math.atan2(p-Math.sqrt(g),f*h),y=Math.atan2(a-i,l-o);return{x:Math.sin(y)*Math.cos(m),y:Math.sin(m),z:Math.cos(y)*Math.cos(m)}}onRangedHit(t,e,n,i,r){t&&t.isPlayer&&this.hud.message(`\u0412\u043B\u0443\u0447\u0430\u043D\u043D\u044F! ${Math.round(n)} \u0448\u043A\u043E\u0434\u0438${r?" (\u0432 \u0433\u043E\u043B\u043E\u0432\u0443)":""}${i?" (\u043A\u0456\u043D\u044C)":""}`,"#ffe9b0"),e.isPlayer&&(this.hud.message(`\u0423 \u0432\u0430\u0441 \u0432\u043B\u0443\u0447\u0438\u043B\u0438: ${Math.round(n)} \u0448\u043A\u043E\u0434\u0438`,"#ff9a8a"),this.hud.damageFlash())}woundChance(t){return t===0?.25+this.heroSkill("surgery")*.05:.3}onDeath(t,e,n){t.companionId?this.hud.message(`${t.name} \u0432\u0442\u0440\u0430\u0447\u0430\u0454 \u0441\u0432\u0456\u0434\u043E\u043C\u0456\u0441\u0442\u044C`,"#ffb0a0"):t.isPlayer?(this.playerDown=!0,this.hud.centerMsg("\u0412\u0430\u0441 \u043F\u043E\u0432\u0430\u043B\u0435\u043D\u043E!",3),this.hud.message("\u0412\u0438 \u0432\u0442\u0440\u0430\u0442\u0438\u043B\u0438 \u0441\u0432\u0456\u0434\u043E\u043C\u0456\u0441\u0442\u044C.","#ff9a8a")):t.entry&&(t.entry.status="down",t.entry.wounded=n==="blunt"||Math.random()<this.woundChance(t.team)),t.ai.target&&t.ai.target.ai&&(t.ai.target.ai.attackers=Math.max(0,(t.ai.target.ai.attackers||1)-1));let i=t.entry?t.entry.wounded:!0;if(e&&e.isPlayer&&!t.isPlayer?(this.playerKills.push(t.tier||1),this.hud.message(`${i?"\u0412\u0438 \u043E\u0433\u043B\u0443\u0448\u0438\u043B\u0438":"\u0412\u0438 \u0432\u0431\u0438\u043B\u0438"}: ${t.name}`,"#ffd66e")):t.team===0&&t.key==="player"&&!t.isPlayer?this.hud.message(`${t.name} ${i?"\u043F\u043E\u0440\u0430\u043D\u0435\u043D\u0438\u0439":"\u0437\u0430\u0433\u0438\u043D\u0443\u0432"}`,"#ffb0a0"):this.config.kind==="arena"&&e&&this.hud.message(`${e.name||"\u0411\u043E\u0454\u0446\u044C"} \u043F\u043E\u0432\u0430\u043B\u0438\u0432 ${t.name}`,"#ddd"),e&&e.kills++,this.sound("grunt",t),this.corpses.push(t),this.corpses.length>110){let r=this.corpses.shift();r.isPlayer||r.dispose()}}releaseHorse(t){t.pos=t.pos.clone(),t.rider=null,this.looseHorses.push(t)}addCorpseHorse(t){t.pos=t.pos.clone(),t.fallT=0,t.fallDir=Math.random()<.5?1:-1,this.deadHorses.push(t);let e=this.looseHorses.indexOf(t);e>=0&&this.looseHorses.splice(e,1)}collideObstacles(t){let e=t.radius;for(let n of this.obstaclesNear(t.pos.x,t.pos.z,e+1)){let i=t.pos.x-n.x,r=t.pos.z-n.z,o=Math.hypot(i,r),a=n.r+e;o<a&&o>1e-4&&(t.pos.x=n.x+i/o*a,t.pos.z=n.z+r/o*a,t.horse&&(t.horse.speed*=.6))}if(this.terrain.arenaR){let n=Math.hypot(t.pos.x,t.pos.z);n>this.terrain.arenaR&&(t.pos.x*=this.terrain.arenaR/n,t.pos.z*=this.terrain.arenaR/n)}}separate(){for(let t of this.agents){if(!t.alive)continue;let e=this.nearby(t.pos.x,t.pos.z,t.radius+1);for(let n of e){if(n.id<=t.id||!n.alive)continue;let i=t.pos.x-n.pos.x,r=t.pos.z-n.pos.z,o=Math.hypot(i,r),a=t.radius+n.radius;if(o>=a||o<1e-5)continue;let l=i/o,c=r/o,h=a-o,d=t.horse?5:1,u=n.horse?5:1,f=u/(d+u),p=d/(d+u),g=t.pos.x+l*h*f,m=t.pos.z+c*h*f,y=n.pos.x-l*h*p,x=n.pos.z-c*h*p;this.terrain.walkable(t.pos.x,t.pos.z,g,m)&&(t.pos.x=g,t.pos.z=m),this.terrain.walkable(n.pos.x,n.pos.z,y,x)&&(n.pos.x=y,n.pos.z=x),this.bump(t,n,-l,-c),this.bump(n,t,l,c)}}}bump(t,e,n,i){if(!t.horse||e.horse||!this.areEnemies(t,e)||t.bumpCd>0||e.bumpCd>0)return;let r=t.horse.speed,o=(t.vel.x*n+t.vel.z*i)/Math.max(.01,Math.abs(r));if(r<5||o<.5)return;let a=Os(r*1.7*(t.horse.item.barding?1.3:1),"blunt",e.bodyArmor);this.fx.spawn("dust",e.pos.x,e.pos.y+.4,e.pos.z,n,i),e.takeDamage(a,t,"blunt",{push:[n*r*.5,i*r*.5]}),e.stun(.9),e.bumpCd=1,t.bumpCd=.4,t.horse.speed*=.7,this.sound("hitHeavy",e),t.isPlayer&&this.hud.message(`\u041A\u0456\u043D\u044C \u0437\u0431\u0438\u0432 \u0432\u043E\u0440\u043E\u0433\u0430 (${Math.round(a)})`,"#ffe9b0"),e.isPlayer&&this.hud.message(`\u0412\u0430\u0441 \u0437\u0431\u0438\u0432 \u043A\u0456\u043D\u044C! ${Math.round(a)} \u0448\u043A\u043E\u0434\u0438`,"#ff9a8a")}playerAttackPress(){let t=this.player;!t||!t.alive||this.paused||t.beginAttack(this.input.attackDir)}playerAttackRelease(){let t=this.player;!t||!t.alive||t.releaseAttack()}playerBlockPress(){let t=this.player;!t||!t.alive||this.paused||t.beginBlock(this.blockDirForPlayer())}playerBlockRelease(){let t=this.player;t&&t.endBlock()}playerNextWeapon(t){let e=this.player;!e||!e.alive||this.paused||(e.nextWeapon(t),this.hud.message(`\u0417\u0431\u0440\u043E\u044F: ${wt[e.weapons[(e.wi+t+e.weapons.length)%e.weapons.length]].name}`))}blockDirForPlayer(){return this.settings.autoBlock&&this.incoming?this.incoming:this.input.blockDir}onKey(t){if(this.ended&&t!=="Tab")return;let e=this.player;switch(t){case"KeyQ":this.playerNextWeapon(1);break;case"Digit1":this.selectGroups(["inf"]);break;case"Digit2":this.selectGroups(["arch"]);break;case"Digit3":this.selectGroups(["cav"]);break;case"Digit0":case"Backquote":this.selectGroups(["inf","arch","cav"]);break;case"KeyZ":case"F1":this.giveOrder("hold");break;case"KeyX":case"F2":this.giveOrder("follow");break;case"KeyC":case"F3":this.giveOrder("charge");break;case"KeyV":this.giveOrder("fire");break;case"KeyF":e&&e.alive&&this.toggleMount();break;case"Tab":this.onTab();break;case"KeyN":this.playerDown&&this.cycleSpectate();break;default:}}selectGroups(t){this.config.kind!=="arena"&&(this.input.selected=new Set(t))}toggleMount(){let t=this.player;if(t.horse){if(Math.abs(t.horse.speed)>2.5){this.hud.message("\u0421\u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u0443\u043F\u0438\u043D\u0456\u0442\u044C \u043A\u043E\u043D\u044F");return}let i=t.horse;i.speed=0,i.rider=null,t.horse=null,t.radius=.36,this.releaseHorse(i),t.pos=t.pos.clone(),t.pos.x+=Math.cos(t.yaw)*1.1,t.pos.z-=Math.sin(t.yaw)*1.1,t.pos.y=this.terrain.heightAt(t.pos.x,t.pos.z),t.vel.set(0,0,0),t.setupMeshes();return}let e=null,n=3.2;for(let i of this.looseHorses){let r=Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z);r<n&&(n=r,e=i)}if(!e){this.hud.message("\u041F\u043E\u0440\u0443\u0447 \u043D\u0435\u043C\u0430\u0454 \u0432\u0456\u043B\u044C\u043D\u043E\u0433\u043E \u043A\u043E\u043D\u044F");return}this.looseHorses.splice(this.looseHorses.indexOf(e),1),e.speed=0,t.mountHorse(e),t.setupMeshes(),this.hud.message(`\u0412\u0438 \u0441\u0456\u043B\u0438 \u043D\u0430 \u043A\u043E\u043D\u044F: ${e.item.name}`)}onTab(){if(this.ended)return;if(this.victoryAt){this.finish("victory");return}if(this.config.kind==="arena"){this.finish(this.player.alive&&!this.agents.some(n=>n.alive&&!n.isPlayer)?"victory":"defeat");return}if(this.playerDown){this.resolveRemainder();return}let t=this.player;if(this.agents.some(n=>n.alive&&n.team!==0&&Math.hypot(n.pos.x-t.pos.x,n.pos.z-t.pos.z)<22)){this.hud.message("\u041D\u0435 \u043C\u043E\u0436\u043D\u0430 \u0432\u0456\u0434\u0441\u0442\u0443\u043F\u0438\u0442\u0438: \u0432\u043E\u0440\u043E\u0433\u0438 \u043D\u0430\u0434\u0442\u043E \u0431\u043B\u0438\u0437\u044C\u043A\u043E!","#ff9a8a");return}this.finish("retreat")}cycleSpectate(){let t=this.agents.filter(n=>n.alive&&n.team===0);if(!t.length)return;let e=t.indexOf(this.camTarget);this.camTarget=t[(e+1)%t.length]}controlPlayer(t){let e=this.player;if(!e||!e.alive)return;let n=this.input,i=(n.down("KeyW")||n.down("ArrowUp")?1:0)-(n.down("KeyS")||n.down("ArrowDown")?1:0),r=(n.down("KeyD")||n.down("ArrowRight")?1:0)-(n.down("KeyA")||n.down("ArrowLeft")?1:0),o=n.down("ShiftLeft")||n.down("ShiftRight");if(e.aimYaw=this.camYaw,e.aimPitch=this.camPitch,e.horse)e.ride.throttle=i,e.ride.turn=-r,e.move.walk=o;else{let a=this.camYaw,l=Math.sin(a),c=Math.cos(a),h=-Math.cos(a),d=Math.sin(a);e.move.x=l*i+h*r,e.move.z=c*i+d*r,e.move.walk=o,e.faceYaw=a}n.rmb&&e.action.s==="block"?e.action.blockDir=this.blockDirForPlayer():n.rmb&&(e.action.s==="idle"||e.action.s==="recover")&&e.beginBlock(this.blockDirForPlayer())}computeIncoming(){let t=this.player;if(this.incoming=null,!t||!t.alive)return;let e=1/0;for(let n of this.nearby(t.pos.x,t.pos.z,6)){if(!n.alive||!this.areEnemies(n,t)||n.ai.target!==t)continue;let i=n.action.s;if(i!=="windup"&&i!=="hold"&&!(i==="swing"&&!n.action.hitDone))continue;let r=Math.hypot(n.pos.x-t.pos.x,n.pos.z-t.pos.z)-n.weapon.reach;r>2.5||r<e&&(e=r,this.incoming=LM[kr(n.action.dir)])}}updateCamera(t){if(this.debugCam){let m=this.debugCam;this.camera.position.set(m.x,m.y,m.z),this.camera.lookAt(m.tx,m.ty,m.tz),this.env.follow(new L(m.tx,m.ty,m.tz),this.camera);return}let e=this.player&&this.player.alive?this.player:null;if(e||((!this.camTarget||!this.camTarget.alive)&&(this.camTarget=this.agents.find(m=>m.alive&&m.team===0)||this.agents.find(m=>m.alive)||this.player),e=this.camTarget),!e)return;let n=!!e.horse,i=new L(e.pos.x,e.pos.y+(n?2.85:1.65),e.pos.z),r=this.camYaw,o=this.camPitch,a=e===this.player?n?5.4:3.1:6,l=Math.sin(r)*Math.cos(o),c=Math.sin(o),h=Math.cos(r)*Math.cos(o),d=-Math.cos(r)*.45,u=Math.sin(r)*.45,f=this.camera,p=new L(i.x-l*a+d,i.y-c*a+.35,i.z-h*a+u),g=this.terrain.heightAt(p.x,p.z)+.4;p.y<g&&(p.y=g),this.camInit?f.position.lerp(p,1-Math.exp(-t*25)):(f.position.copy(p),this.camInit=!0),f.lookAt(i.x+l*30+d,i.y+c*30+.35,i.z+h*30+u),this.env.follow(i,f)}updateHorses(t){for(let e of this.looseHorses){e.speed*=Math.exp(-t*.8),Math.abs(e.speed)<.2&&(e.speed=0);let n=e.pos.x+Math.sin(e.yaw)*e.speed*t,i=e.pos.z+Math.cos(e.yaw)*e.speed*t;this.terrain.walkable(e.pos.x,e.pos.z,n,i)?(e.pos.x=n,e.pos.z=i):e.speed=0,e.pos.y=this.terrain.heightAt(e.pos.x,e.pos.z),e.phase+=Math.abs(e.speed)*t*1.25;let r=Math.min(.75,Math.abs(e.speed)*.085);e.rig.legs.forEach((o,a)=>{o.rotation.x=Math.sin(e.phase+[0,.5,Math.PI,Math.PI+.5][a])*r}),e.rig.root.position.copy(e.pos),e.rig.root.rotation.y=e.yaw}for(let e of this.deadHorses){if(e.fallT>=1)continue;e.fallT=Math.min(1,e.fallT+t*1.8);let n=e.fallT;e.rig.root.position.copy(e.pos),e.rig.root.position.y-=.35*n,e.rig.root.rotation.y=e.yaw,e.rig.root.rotation.z=e.fallDir*(Math.PI/2)*n,e.rig.body.position.y=-.15*n}}frame(t){if(t=Math.min(t,.05),!this.paused&&!this.ended){let e=t>.025?2:1;for(let n=0;n<e&&!this.ended;n++)this.step(t/e)}if(!this.ended){this.updateCamera(t);for(let e of this.agents)(e.alive||e.fallT<1)&&e.animate(this.paused?0:t);this.paused||(this.fx.update(t),this.terrain.update(this.time,this.camera)),this.hud.update(),this.post?this.post.render():this.renderer.render(this.scene,this.camera)}}step(t){this.time+=t,this.tipUntil&&this.time>this.tipUntil&&(this.tipUntil=0,this.hud.showHint(null)),this.input.decay(t),this.rebuildGrid(),this.controlPlayer(t),this.computeIncoming(),this.updateTeamAI(t);for(let e of this.agents)!e.alive||e.isPlayer||qm(this,e,t);for(let e of this.agents)e.alive&&e.updateAction(t);for(let e of this.agents)e.integrate(t);this.rebuildGrid(),this.separate(),this.updateHorses(t),this.projectiles.update(t),this.checkEnd()}checkEnd(){if(this.ended)return;if(this.config.kind==="arena"){let n=this.agents.filter(i=>i.alive&&!i.isPlayer).length;this.playerDown&&!this.endTimer&&(this.endTimer=this.time+2.5,this.hud.showHint("\u0412\u0430\u0441 \u043F\u043E\u0432\u0430\u043B\u0435\u043D\u043E. Tab \u2014 \u043F\u043E\u043A\u0438\u043D\u0443\u0442\u0438 \u0430\u0440\u0435\u043D\u0443")),!this.playerDown&&n===0&&!this.victoryAt&&(this.victoryAt=this.time,this.hud.centerMsg("\u0412\u0438 \u043F\u0435\u0440\u0435\u043C\u043E\u0436\u0435\u0446\u044C \u0430\u0440\u0435\u043D\u0438!",4),this.hud.showHint("Tab \u2014 \u043F\u043E\u043A\u0438\u043D\u0443\u0442\u0438 \u0430\u0440\u0435\u043D\u0443"),this.game.sfx.cheer()),this.endTimer&&this.time>this.endTimer+1.5&&this.finish("defeat");return}let e=this.teamCounts();!this.victoryAt&&e[1].alive===0&&e[1].reserve===0&&(this.victoryAt=this.time,this.hud.centerMsg("\u041F\u0435\u0440\u0435\u043C\u043E\u0433\u0430!",5),this.hud.showHint("Tab \u2014 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0431\u0438\u0442\u0432\u0443"),this.game.sfx.cheer()),this.victoryAt&&this.time>this.victoryAt+6&&this.finish("victory"),e[0].alive===0&&e[0].reserve===0&&!this.victoryAt&&(this.hud.centerMsg("\u041F\u043E\u0440\u0430\u0437\u043A\u0430\u2026",3),this.endTimer||(this.endTimer=this.time+2.5)),this.endTimer&&this.time>this.endTimer&&!this.victoryAt&&this.finish("defeat"),this.playerDown&&!this.victoryAt&&e[0].alive>0&&this.hud.showHint("\u0412\u0430\u0441 \u043F\u043E\u0432\u0430\u043B\u0435\u043D\u043E. Tab \u2014 \u0434\u043E\u0440\u0443\u0447\u0438\u0442\u0438 \u0431\u0456\u0439 \u0437\u0430\u0433\u043E\u043D\u0443 (\u0430\u0432\u0442\u043E\u0431\u0456\u0439) \xB7 N \u2014 \u0456\u043D\u0448\u0438\u0439 \u0432\u043E\u0457\u043D")}resolveRemainder(){let t=[0,1].map(i=>{let r=[];for(let o of this.agents)o.alive&&o.team===i&&o.entry&&r.push({key:`e${o.id}`,troopId:o.troopId,count:1,entry:o.entry});for(let o of this.teams[i].reserve)r.push({key:`r${r.length}`,troopId:o.troopId,count:1,entry:o});return r}),e=(this.companions||[]).filter(i=>i.alive).map(i=>({key:`comp:${i.companionId}`,hp:i.hp,power:12+i.tier*2,armor:i.bodyArmor})),n=gi([{stacks:t[0],heroes:e,bonus:1+this.heroSkill("tactics")*.04,woundChance:this.woundChance(0)},{stacks:t[1],bonus:this.config.kind==="siege"?1.3:1,woundChance:this.woundChance(1)}]);for(let i=0;i<2;i++)for(let r of t[i]){let o=n.losses[i].get(r.key);if(!o)continue;let a=Object.keys(o.wounded).length>0;r.entry.status="down",r.entry.wounded=a}for(let i of this.companions||[])n.heroesDown.has(`comp:${i.companionId}`)&&(i.hp=1);this.finish(n.winner===0?"victory":"defeat")}finish(t){if(this.ended)return;this.ended=!0;let e=[new Map,new Map];for(let i=0;i<2;i++)for(let r of this.teams[i].all){if(r.status!=="down")continue;let o=e[i].get(r.key);o||e[i].set(r.key,o={killed:{},wounded:{}});let a=r.wounded?o.wounded:o.killed;a[r.troopId]=(a[r.troopId]||0)+1}let n={outcome:t,losses:e,playerDown:this.playerDown,playerKills:this.playerKills,playerHp:this.player?this.player.alive?this.player.hp:3:void 0,companionHp:Object.fromEntries((this.companions||[]).map(i=>[i.companionId,i.alive?i.hp:1]))};this.dispose(),this.onFinish(n)}showStartOverlay(){let t=this.config,e=this.teamCounts(),n=t.kind==="arena"?"\u0410\u0440\u0435\u043D\u0430":t.kind==="siege"?`\u0428\u0442\u0443\u0440\u043C: ${t.fortName||""}`:"\u0411\u0438\u0442\u0432\u0430",i=t.kind==="arena"?"\u0412\u0441\u0456 \u043F\u0440\u043E\u0442\u0438 \u0432\u0441\u0456\u0445 \u0442\u0440\u0435\u043D\u0443\u0432\u0430\u043B\u044C\u043D\u043E\u044E \u0437\u0431\u0440\u043E\u0454\u044E. \u041E\u0441\u0442\u0430\u043D\u043D\u0456\u0439 \u043D\u0430 \u043D\u043E\u0433\u0430\u0445 \u043F\u0435\u0440\u0435\u043C\u0430\u0433\u0430\u0454.":`${t.sides[0].name}: ${e[0].alive+e[0].reserve}  \xB7  ${t.sides[1].name}: ${e[1].alive+e[1].reserve}`;this.overlay=b("div",{class:"pause-overlay"},b("div",{class:"window narrow"},b("div",{class:"window-title"},n),b("div",{class:"window-body"},b("p",null,i),b("p",{class:"muted",style:{fontSize:"14px"}},"\u041C\u0438\u0448\u0430 \u2014 \u043E\u0433\u043B\u044F\u0434 \u0456 \u043D\u0430\u043F\u0440\u044F\u043C \u0443\u0434\u0430\u0440\u0443 \xB7 \u041B\u041A\u041C \u2014 \u0443\u0434\u0430\u0440 (\u0443\u0442\u0440\u0438\u043C\u0443\u0439\u0442\u0435 \u0434\u043B\u044F \u0437\u0430\u043C\u0430\u0445\u0443) \xB7 \u041F\u041A\u041C \u2014 \u0431\u043B\u043E\u043A \xB7 WASD \u2014 \u0440\u0443\u0445 \xB7 Q \u2014 \u0437\u0431\u0440\u043E\u044F \xB7 1/2/3/0 + Z/X/C \u2014 \u043D\u0430\u043A\u0430\u0437\u0438 \xB7 Tab \u2014 \u0432\u0456\u0434\u0441\u0442\u0443\u043F"),b("p",null,b("b",null,"\u041A\u043B\u0430\u0446\u043D\u0456\u0442\u044C \u043F\u043E \u0435\u043A\u0440\u0430\u043D\u0443, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438."))))),this.overlay.addEventListener("click",()=>this.input.lock()),this.root.append(this.overlay)}onLock(){this.overlay&&(this.overlay.remove(),this.overlay=null),this.paused=!1,this.started||(this.started=!0,this.game.sfx.horn(),this.settings.seenBattleTips||(this.settings.seenBattleTips=!0,this.game.saveSettings(),this.tipUntil=this.time+22,this.hud.showHint("\u041F\u043E\u0440\u0430\u0434\u0430: \u0440\u0443\u0445\u043D\u0456\u0442\u044C \u043C\u0438\u0448\u0435\u044E \u0432\u043B\u0456\u0432\u043E, \u0432\u043F\u0440\u0430\u0432\u043E, \u0432\u0433\u043E\u0440\u0443 \u0447\u0438 \u0432\u043D\u0438\u0437 \u2014 \u0456 \u043D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u041B\u041A\u041C, \u0449\u043E\u0431 \u0443\u0434\u0430\u0440\u0438\u0442\u0438 \u0437 \u0446\u044C\u043E\u0433\u043E \u0431\u043E\u043A\u0443.<br>\u0423\u0442\u0440\u0438\u043C\u0443\u0439\u0442\u0435 \u041F\u041A\u041C, \u0449\u043E\u0431 \u0431\u043B\u043E\u043A\u0443\u0432\u0430\u0442\u0438. \u0427\u0435\u0440\u0432\u043E\u043D\u0430 \u0441\u0442\u0440\u0456\u043B\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0443\u0454, \u0437\u0432\u0456\u0434\u043A\u0438 \u043B\u0435\u0442\u0438\u0442\u044C \u0432\u043E\u0440\u043E\u0436\u0438\u0439 \u0443\u0434\u0430\u0440.")))}onUnlock(){if(this.ended||(this.paused=!0,this.overlay))return;let t=b("button",{class:"btn",onclick:e=>{e.stopPropagation(),this.onTab()}},this.config.kind==="arena"?"\u041F\u043E\u043A\u0438\u043D\u0443\u0442\u0438 \u0430\u0440\u0435\u043D\u0443":this.playerDown?"\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0431\u0438\u0442\u0432\u0443 (\u0430\u0432\u0442\u043E\u0431\u0456\u0439)":"\u0412\u0456\u0434\u0441\u0442\u0443\u043F\u0438\u0442\u0438");this.overlay=b("div",{class:"pause-overlay"},b("div",{class:"window narrow"},b("div",{class:"window-title"},"\u041F\u0430\u0443\u0437\u0430"),b("div",{class:"window-body"},b("div",{class:"menu-list",style:{width:"100%"}},b("button",{class:"btn primary",onclick:e=>{e.stopPropagation(),this.input.lock()}},"\u041F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438 \u0431\u0456\u0439"),t),b("p",{class:"muted",style:{fontSize:"13px",marginTop:"12px"}},"\u0412\u0456\u0434\u0441\u0442\u0443\u043F\u0438\u0442\u0438 \u043C\u043E\u0436\u043D\u0430, \u043A\u043E\u043B\u0438 \u043F\u043E\u0440\u0443\u0447 \u043D\u0435\u043C\u0430\u0454 \u0432\u043E\u0440\u043E\u0433\u0456\u0432. \u041D\u0430\u043F\u0440\u044F\u043C \u0443\u0434\u0430\u0440\u0443 \u2014 \u0440\u0443\u0445 \u043C\u0438\u0448\u0456 \u043F\u0435\u0440\u0435\u0434 \u0430\u0442\u0430\u043A\u043E\u044E; \u0441\u0442\u0440\u0456\u043B\u043A\u0430 \u0431\u0456\u043B\u044F \u043F\u0440\u0438\u0446\u0456\u043B\u0443 \u043F\u043E\u043A\u0430\u0437\u0443\u0454 \u0439\u043E\u0433\u043E.")))),this.root.append(this.overlay)}debugStart(){this.onLock()}debugSimulate(t,e=1/30){let n=Math.round(t/e);for(let i=0;i<n&&!this.ended;i++)if(this.step(e),i%3===0)for(let r of this.agents)(r.alive||r.fallT<1)&&r.animate(e*3)}dispose(){window.removeEventListener("resize",this.onResize),this.input.dispose(),this.scene.traverse(t=>{t.isMesh&&t.geometry&&!t.geometry.__cached&&t.geometry!==void 0&&(t.parent===this.terrain.group||t===this.sky)&&t.geometry.dispose()}),this.post&&this.post.dispose(),this.env&&this.env.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss?.(),window.__battle===this&&(window.__battle=null)}};var{playerHero:NM}=ka,xh="kinklynok-save-",t0="kinklynok-settings",UM=["auto","1","2","3"],kM=1.6,FM={battleSize:60,sensitivity:1,invertY:!1,autoBlock:!0,shadows:!0,graphics:"medium",quality:1,volume:.6,mapSpeed:1,playerDamage:.75};function OM(){try{let s="__kk_test__";return window.localStorage.setItem(s,"1"),window.localStorage.removeItem(s),window.localStorage}catch{let s=new Map;return{getItem:t=>s.has(t)?s.get(t):null,setItem:(t,e)=>s.set(t,String(e)),removeItem:t=>s.delete(t)}}}var Iu=class{constructor(){this.storage=OM(),this.settings={...FM};try{Object.assign(this.settings,JSON.parse(this.storage.getItem(t0)||"{}"))}catch{}this.canvas=document.getElementById("map-canvas"),this.battleRoot=document.getElementById("battle-root"),this.uiRoot=document.getElementById("ui-root"),this.sfx=new Oa(this.settings),this.ui=new Kr(this,this.uiRoot),this.map=new Aa(this.canvas,this),this.map.onClickEntity=(t,e,n)=>this.onMapClick(t,e,n),this.hud=null,this.world=null,this.mode="menu",this.waiting=!1,this.speed=1,this.battle=null,this.busy=!1,this.lastT=performance.now(),this.lastAutosaveDay=0,this.bindKeys(),window.addEventListener("pointerdown",()=>this.sfx.resume(),{once:!1}),this.ui.showMainMenu(),requestAnimationFrame(t=>this.loop(t))}saveSettings(){try{this.storage.setItem(t0,JSON.stringify(this.settings))}catch{}}newGame(t){let e=this.ui.loading("\u0422\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0441\u0432\u0456\u0442\u0443\u2026");setTimeout(()=>{try{let n=Ih(t);this.setWorld(new Zs(n));let i=this.world,r=i.sById.get(n.startTown);i.message(`\u0412\u0430\u0448\u0430 \u043F\u043E\u0434\u043E\u0440\u043E\u0436 \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0431\u0456\u043B\u044F \u043C\u0456\u0441\u0442\u0430 ${r.name}.`,"good"),e(),this.map.centerOnPlayer(),this.map.cam.zoom=1.2,this.showIntro(r)}catch(n){e(),console.error(n),this.ui.toast(`\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0441\u0432\u0456\u0442\u0443: ${n.message}`,6e3)}},30)}showIntro(t){let e=Ht[t.faction],n=`\u0412\u0438 \u043F\u0440\u0438\u0431\u0443\u0432\u0430\u0454\u0442\u0435 \u0434\u043E \u043C\u0456\u0441\u0442\u0430 ${t.name}, \u0449\u043E \u043D\u0430\u043B\u0435\u0436\u0438\u0442\u044C ${e.name}. \u041A\u0430\u043B\u044C\u0434\u0435\u0440\u0456\u044F \u0440\u043E\u0437\u0434\u0435\u0440\u0442\u0430 \u0432\u0456\u0439\u043D\u0430\u043C\u0438: \u0447\u043E\u0442\u0438\u0440\u0438 \u0434\u0435\u0440\u0436\u0430\u0432\u0438 \u0437\u043C\u0430\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u0437\u0430 \u0437\u0435\u043C\u043B\u0456, \u0430 \u043D\u0430 \u0434\u043E\u0440\u043E\u0433\u0430\u0445 \u0433\u043E\u0441\u043F\u043E\u0434\u0430\u0440\u044E\u044E\u0442\u044C \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0438.

\u0417\u0431\u0435\u0440\u0456\u0442\u044C \u0437\u0430\u0433\u0456\u043D, \u0437\u0434\u043E\u0431\u0443\u0434\u044C\u0442\u0435 \u0441\u043B\u0430\u0432\u0443 \u0456 \u0431\u0430\u0433\u0430\u0442\u0441\u0442\u0432\u043E \u2014 \u0441\u043B\u0443\u0436\u0456\u0442\u044C \u043A\u043E\u0440\u043E\u043B\u044F\u043C \u0430\u0431\u043E \u0437\u0431\u0443\u0434\u0443\u0439\u0442\u0435 \u0432\u043B\u0430\u0441\u043D\u0435 \u043A\u043E\u0440\u043E\u043B\u0456\u0432\u0441\u0442\u0432\u043E.

\u041F\u043E\u0440\u0430\u0434\u0430: \u043D\u0430\u0431\u0435\u0440\u0456\u0442\u044C \u0434\u043E\u0431\u0440\u043E\u0432\u043E\u043B\u044C\u0446\u0456\u0432 \u0443 \u043D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u043E\u043C\u0443 \u0441\u0435\u043B\u0456, \u043A\u0443\u043F\u0456\u0442\u044C \u043F\u0440\u043E\u0432\u0456\u0437\u0456\u044E \u043D\u0430 \u0440\u0438\u043D\u043A\u0443 \u0456 \u043F\u043E\u043B\u044E\u0439\u0442\u0435 \u043D\u0430 \u0440\u043E\u0437\u0431\u0456\u0439\u043D\u0438\u043A\u0456\u0432. \u041A\u043B\u0430\u0446\u0430\u0439\u0442\u0435 \u043F\u043E \u043C\u0430\u043F\u0456, \u0449\u043E\u0431 \u0440\u0443\u0445\u0430\u0442\u0438\u0441\u044F.`;this.ui.windows.show({title:"\u041F\u043E\u0447\u0430\u0442\u043E\u043A \u043F\u0440\u0438\u0433\u043E\u0434\u0438",body:this.ui.introBody?this.ui.introBody(n):document.createTextNode(n),cls:"narrow",onClose:()=>this.ui.openSettlement(t.id),footer:[]});let i=this.ui.windows.stack[this.ui.windows.stack.length-1];i.body.style.whiteSpace="pre-line";let r=document.createElement("button");r.className="btn primary",r.textContent=`\u0423\u0432\u0456\u0439\u0442\u0438 \u0434\u043E \u043C\u0456\u0441\u0442\u0430 ${t.name}`,r.onclick=()=>this.ui.windows.close(i),i.footer.style.display="",i.footer.append(r)}setWorld(t){this.world=t,Wu(t.state.nextId+1),this.ui.clearScreen(),this.ui.windows.closeAll(),this.map.buildTexture(t),this.hud&&this.hud.root.remove(),this.hud=new Fa(this,this.uiRoot);for(let e of t.state.log.slice(-5))this.hud.pushLog(e.text,e.kind);t.on("message",({text:e,kind:n})=>this.hud&&this.hud.pushLog(e,n)),t.on("day",({day:e})=>{e-this.lastAutosaveDay>=3&&(this.lastAutosaveDay=e,this.autosave())}),this.mode="map",this.canvas.style.display="",this.waiting=!1,this.lastAutosaveDay=t.day}quitToMenu(){this.autosave(),this.world=null,this.hud&&this.hud.root.remove(),this.hud=null,this.mode="menu",this.ui.showMainMenu()}saveGame(t){if(!this.world)return!1;let e=this.world.state,n={name:e.player.name,level:e.player.level,day:this.world.day,savedAt:Date.now()};try{return this.storage.setItem(xh+t,JSON.stringify({info:n,state:e})),!0}catch(i){return console.error(i),this.ui.toast("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0433\u0440\u0443"),!1}}autosave(){this.world&&this.mode==="map"&&!this.world.skipping&&this.saveGame("auto")}listSaves(){return UM.map(t=>{let e=null;try{let n=this.storage.getItem(xh+t);n&&(e=JSON.parse(n).info)}catch{e=null}return{slot:t,info:e}})}deleteSave(t){this.storage.removeItem(xh+t)}loadGame(t){let e=this.storage.getItem(xh+t);if(!e)return;let n=this.ui.loading("\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u2026");setTimeout(()=>{try{let{state:i}=JSON.parse(e);this.setWorld(new Zs(i)),this.map.centerOnPlayer(),n(),this.ui.toast("\u0413\u0440\u0443 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E")}catch(i){n(),console.error(i),this.ui.toast(`\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043F\u043E\u0448\u043A\u043E\u0434\u0436\u0435\u043D\u0435: ${i.message}`,5e3)}},30)}onMapClick(t,e,n){if(this.mode!=="map"||!this.world||this.ui.windows.open||this.busy)return;let i=this.world,r=i.state.party;this.waiting=!1;let o=!0;if(!t)o=i.orderPlayerMove(e,n);else if(t.type==="settlement"){let a=t.e;if(Math.hypot(a.x-r.x,a.y-r.y)<24){i.stopPlayer(),this.ui.openSettlement(a.id);return}o=i.orderPlayerTarget("settlement",a.id)}else if(t.type==="party")o=i.orderPlayerTarget("party",t.id);else if(t.type==="battle")o=i.orderPlayerTarget("battle",t.id);else if(t.type==="player"){i.stopPlayer();return}o?this.map.follow=!0:this.ui.toast("\u0422\u0443\u0434\u0438 \u043D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u043E \u0434\u0456\u0441\u0442\u0430\u0442\u0438\u0441\u044F")}handleWorldEvent(t){this.waiting=!1,t&&(t.type==="settlement"?this.ui.openSettlement(t.id):t.type==="encounter"?this.ui.openEncounter(t.id,t.initiator):t.type==="battleSite"&&this.ui.openBattleSite(t.id))}onMenuClosed(){}toggleWait(){this.ui.windows.open||(this.waiting=!this.waiting,this.waiting&&this.world.stopPlayer())}setSpeed(t){this.speed=t}waitHours(t,e={}){let n=this.world;return this.busy=!0,n.state.party.resting=!!e.heal,new Promise(i=>{let r=t,o=()=>{let a=Math.min(r,1);r-=a;let l=n.advance(a);if(this.hud&&this.hud.update(),l&&e.stopOnEvent||r<=1e-6){this.busy=!1,n.state.party.resting=!1,i(l&&e.stopOnEvent?l:null);return}requestAnimationFrame(o)};requestAnimationFrame(o)})}startBattle(t,e){this.ui.windows.closeAll(),this.mode="battle",this.waiting=!1,this.canvas.style.display="none",this.hud&&this.hud.show(!1),this.battleRoot.style.display="block",this.sfx.resume();try{this.battle=new yh(this,this.battleRoot,t,n=>{this.battle=null,this.battleRoot.style.display="none",this.battleRoot.innerHTML="",this.canvas.style.display="",this.hud&&this.hud.show(!0),this.mode="map",e(n)})}catch(n){console.error(n),this.battle=null,this.battleRoot.style.display="none",this.battleRoot.innerHTML="",this.canvas.style.display="",this.hud&&this.hud.show(!0),this.mode="map",this.ui.toast(`\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043F\u043E\u0447\u0430\u0442\u0438 \u0431\u0438\u0442\u0432\u0443: ${n.message}`,6e3),e({outcome:"retreat",losses:[new Map,new Map],playerKills:[],aborted:!0})}}debugBattle(t="field",e={}){this.world||this.setWorld(new Zs(Ih({seed:7,background:e.background||"knight"})));let n=e.allies||[["velmar_footman",8],["velmar_crossbow",5],["velmar_knight",3]],i=e.enemies||[["nord_trained",8],["nord_archer",5],["kag_horse_archer",3]],r={kind:t,terrain:e.terrain||"plains",hour:e.hour??12,sides:[{name:"\u0412\u0430\u0448\u0456 \u0441\u0438\u043B\u0438",units:n.map(([o,a])=>({key:"player",troopId:o,count:a})),hero:NM(this.world)},{name:"\u0412\u043E\u0440\u043E\u0433\u0438",units:i.map(([o,a])=>({key:"enemy",troopId:o,count:a}))}],factionColors:["#3f6fb5","#a8322a"],arenaFighters:7,fortName:"\u0422\u0435\u0441\u0442\u043E\u0432\u0430 \u0444\u043E\u0440\u0442\u0435\u0446\u044F"};return this.startBattle(r,o=>{this.lastDebugResult=o}),this.battle}bindKeys(){window.addEventListener("keydown",t=>{if(!(t.target&&(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA"))&&this.mode!=="battle"&&this.mode==="map"){if(t.code==="Escape"){this.ui.windows.closeTop()||this.ui.openGameMenu(),t.preventDefault();return}if(!(this.ui.windows.open||this.busy))switch(this.map.keys.add(t.code),t.code){case"Space":this.toggleWait(),t.preventDefault();break;case"KeyP":this.ui.openParty();break;case"KeyC":this.ui.openCharacter();break;case"KeyI":this.ui.openInventory();break;case"KeyJ":case"KeyQ":this.ui.openJournal();break;case"KeyF":this.ui.openFactions();break;case"Home":this.map.centerOnPlayer();break;default:}}}),window.addEventListener("keyup",t=>this.map.keys.delete(t.code)),window.addEventListener("blur",()=>this.map.keys.clear())}loop(t){let e=Math.min(.1,(t-this.lastT)/1e3);this.lastT=t;try{if(this.mode==="map"&&this.world){let n=this.world;if(!this.ui.windows.open&&!this.busy&&(n.playerMoving()||this.waiting)){let i=e*kM*this.speed*(this.settings.mapSpeed||1),r=n.advance(i);r&&this.handleWorldEvent(r)}this.map.update(e),this.map.draw(),this.hud&&this.hud.update()}else this.mode==="battle"&&this.battle&&this.battle.frame(e)}catch(n){console.error(n),this.ui.toast(`\u041F\u043E\u043C\u0438\u043B\u043A\u0430: ${n.message}`,5e3)}requestAnimationFrame(n=>this.loop(n))}};window.addEventListener("DOMContentLoaded",()=>{window.game=new Iu,window.__conflict=ka});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
