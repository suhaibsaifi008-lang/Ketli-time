export const conceptNote='An academic marketing concept. Blends, 50 g packs and ₹299 prices are illustrative. No real orders or payments.';
export const storageNote='Keep sealed in a cool, dry place, away from sunlight and strong smells.';
export const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
export const galleryViews=[
  {id:'cup',label:'Meet the tea',title:'Your next little ritual',description:'The approved paper kettle and a freshly brewed cup.'},
  {id:'botanical',label:'Inside the blend',title:'Four ingredients. One lovely cup.',description:'The complete proposed recipe and what each ingredient brings.'},
  {id:'ritual',label:'Why choose it',title:'Three reasons to make time',description:'Clear everyday benefits, built around flavour and ritual.'},
  {id:'benefits',label:'Your tea moment',title:'A cup that fits your day',description:'Flavour, occasion and serving inspiration.'},
  {id:'label',label:'Read the label',title:'Good things, clearly labelled',description:'Coordinated front and back labels for the 50 g concept pack.'},
  {id:'packaging',label:'The little kettle',title:'Thoughtful inside and out',description:'A folded carton outside and a separate sealed pouch inside.'}
];
const ingredient=(name,note,image)=>({name,note,image});
export const teas=[
  {
    id:'mehak',name:'Mehak',type:'Rose petal',botanical:'Rose petals',meaning:'Fragrance',tagline:'Let the morning unfold.',colour:'#8f1023',wash:'#eee0d8',category:'floral',time:'Morning or evening',taste:'Floral, delicate and gently citrusy',notes:['Rose garden','Citrus lift','Soft finish'],profile:[4,2,1,1],moment:'soft',format:'either',
    intro:'Rose petals meet rosehips, lemongrass and orange peel in a fragrant blend made for softer starts and unhurried evenings.',
    story:'Mehak means fragrance. Its rose-led character opens with a garden-like aroma, while rosehips add a little tang. Lemongrass and orange peel bring a clean citrus finish. A delicate blend to enjoy slowly, warm in your hands or poured over ice.',
    ingredients:[ingredient('Rose petals','Delicate floral fragrance','rose'),ingredient('Rosehips','A gently fruity tang','rosehips'),ingredient('Lemongrass','A fresh citrus lift','lemongrass'),ingredient('Orange peel','A rounded, zesty finish','orange')],
    benefits:[['A softer pause','Delicate floral flavour for a gentle morning or evening ritual.'],['Lovely without added sugar','Fragrance and citrus give an unsweetened cup plenty of character.'],['Two ways to unwind','Enjoy warm, or cool and pour over ice for a floral refreshment.']],
    helps:'A fragrant floral cup for gentle breaks, enjoyable warm or iced.',temp:95,minutes:5,colourOfCup:'Light gold with a rosy blush',pairing:'A quiet morning, almond biscuits or a few good pages.',
    brew:'Cover while steeping to keep the floral aroma in the cup. Strain and taste before adding anything.',
    iced:'Brew a little stronger, strain and cool, then pour over ice for a bright floral cup.'
  },
  {
    id:'aanch',name:'Aanch',type:'Black pepper',botanical:'Black pepper',meaning:'Warmth',tagline:'A bold little spark in your cup.',colour:'#414039',wash:'#e5e2d9',category:'pepper',time:'Morning or afternoon',taste:'Bold, peppery and warmly spiced',notes:['Black pepper','Ginger warmth','Orange finish'],profile:[0,2,4,0],moment:'bold',format:'hot',
    intro:'Black pepper, ginger and cinnamon bring bold warmth, softened by orange peel. An earthy, aromatic blend with a little spark.',
    story:'Aanch takes its name from heat and warmth. Black pepper brings the first aromatic spark; ginger and cinnamon round it into a fuller, warming cup. Orange peel adds a bright finish. Begin with a gentle steep and find the strength that suits you.',
    ingredients:[ingredient('Black pepper','Bold, earthy pepperiness','pepper'),ingredient('Ginger','Lively, warming spice','ginger'),ingredient('Cinnamon','Woody, sweet-spiced depth','cinnamon'),ingredient('Orange peel','A bright citrus finish','orange')],
    benefits:[['Warm up your break','A bold, warming cup for chilly mornings and rainy afternoons.'],['A change from coffee','A caffeine-free option when you want flavour with a little more presence.'],['Spice, served simply','Pepper, ginger and citrus make an expressive unsweetened drink.']],
    helps:'Bold peppery warmth and an unsweetened alternative to coffee.',temp:100,minutes:5,colourOfCup:'Light golden amber',pairing:'A savoury snack, a morning pause or an afternoon conversation.',
    brew:'Start with a level teaspoon of the blend. Cover, steep and strain carefully; shorten the steep for gentler spice.',
    iced:'Steep gently, strain and cool before adding ice. Keep the first chilled cup mild.'
  },
  {
    id:'taazgi',name:'Taazgi',type:'Cinnamon',botanical:'Cinnamon',meaning:'Freshness',tagline:'Make room for a little spice.',colour:'#95623f',wash:'#eadfce',category:'herbal',time:'Afternoon',taste:'Sweet-spiced, woody and softly fruity',notes:['Cinnamon bark','Apple softness','Cardamom aroma'],profile:[0,2,3,0],moment:'spice',format:'either',
    intro:'Cinnamon, dried apple, orange peel and cardamom come together in a comforting blend with a fresh, fruity twist.',
    story:'Taazgi pairs the familiar warmth of cinnamon with mellow apple and bright orange peel. Cardamom gives the aroma a lightly fragrant finish. It is a cup for the middle of the day: familiar enough to feel comforting, lively enough to make a break feel new.',
    ingredients:[ingredient('Cinnamon','Warm, woody sweetness','cinnamon'),ingredient('Dried apple','Mellow fruit notes','apple'),ingredient('Orange peel','A fresh citrus edge','orange'),ingredient('Cardamom','A fragrant spiced finish','cardamom')],
    benefits:[['Comfort in a cup','Familiar cinnamon and apple make an inviting afternoon ritual.'],['Sweet-spiced character','Enjoy the blend’s warm aroma without starting with a sweetened drink.'],['Warm or refreshing','Comforting hot and pleasantly fruity when served over ice.']],
    helps:'A comforting, sweet-spiced afternoon cup.',temp:100,minutes:7,colourOfCup:'Clear warm amber',pairing:'An afternoon break, an oat biscuit or a slice of apple.',
    brew:'Cover the loose blend with freshly boiled water. Steep, strain and enjoy the woody spice and fruit notes.',
    iced:'Brew slightly stronger, strain and cool before adding ice. Enjoy the apple and orange notes plain first.'
  },
  {
    id:'rahat',name:'Rahat',type:'Ginger',botanical:'Ginger',meaning:'Comfort',tagline:'A little warmth goes a long way.',colour:'#b28a50',wash:'#eee2cc',category:'herbal',time:'Afternoon or after a meal',taste:'Zesty, warming and citrus-fresh',notes:['Ginger root','Lemon zest','Cardamom finish'],profile:[0,3,3,0],moment:'warm',format:'hot',
    intro:'Ginger brings the warmth. Lemongrass, lemon peel and cardamom add a crisp, aromatic finish to this comforting cup.',
    story:'Rahat means comfort. This ginger-led blend balances a lively spice with the citrus character of lemongrass and lemon peel. Cardamom rounds the aroma. Made for rainy windows, kitchen conversations and the pleasure of holding something warm.',
    ingredients:[ingredient('Ginger','Lively, warming spice','ginger'),ingredient('Lemongrass','Clean citrus aroma','lemongrass'),ingredient('Lemon peel','A crisp, zesty finish','lemon'),ingredient('Cardamom','Rounded aromatic depth','cardamom')],
    benefits:[['A warming little ritual','Ginger gives cold-weather breaks a cosy character.'],['A fresh finish','Lemon and lemongrass refresh the palate after a meal.'],['More flavour, simply','An expressive alternative to a sweetened hot drink.']],
    helps:'Warming ginger with a refreshing citrus finish.',temp:100,minutes:7,colourOfCup:'Clear warm gold',pairing:'A rainy afternoon, savoury snacks or a slice of citrus cake.',
    brew:'Cover with freshly boiled water, steep and strain. Taste at five minutes for a gentler ginger finish.',
    iced:'Brew, strain and cool before pouring over ice. The citrus notes make a lively chilled cup.'
  },
  {
    id:'sukoon',name:'Sukoon',type:'Tulsi',botanical:'Tulsi',meaning:'Quiet',tagline:'Leave a little room for quiet.',colour:'#65764e',wash:'#e0e5d5',category:'herbal',time:'Evening',taste:'Herbal, mellow and softly floral',notes:['Tulsi leaves','Soft chamomile','Fennel finish'],profile:[2,1,2,1],moment:'quiet',format:'hot',
    intro:'Earthy tulsi, soft chamomile, fennel and lemongrass make a mellow herbal blend for an unhurried evening.',
    story:'Sukoon means quiet. Tulsi forms the earthy heart of the blend, with chamomile bringing soft floral notes. Fennel lends a rounded finish and lemongrass keeps the cup fresh. An invitation to put your phone down and make a little space in your evening.',
    ingredients:[ingredient('Tulsi','Earthy, herbaceous depth','tulsi'),ingredient('Chamomile','Soft floral notes','chamomile'),ingredient('Fennel','A mellow, rounded finish','fennel'),ingredient('Lemongrass','A light citrus lift','lemongrass')],
    benefits:[['An evening-friendly cup','A caffeine-free choice for your wind-down ritual.'],['A mellow flavour','Herbal, floral and fennel notes create a rounded cup.'],['Make room for quiet','A warm companion to a book, a conversation or a screen-free break.']],
    helps:'A mellow herbal choice for an evening wind-down ritual.',temp:95,minutes:5,colourOfCup:'Muted golden green',pairing:'An evening book, a quiet conversation or a screen-free pause.',
    brew:'Cover while the loose botanicals infuse, then strain. Begin with five minutes and adjust the next cup to taste.',
    iced:'Chill the strained blend and serve over ice for an earthy, gently floral refreshment.'
  },
  {
    id:'roohani',name:'Roohani',type:'Hibiscus',botanical:'Hibiscus',meaning:'Soulful',tagline:'Put a little colour in your day.',colour:'#4b0d20',wash:'#eadce0',category:'floral',time:'Afternoon, especially iced',taste:'Ruby-red, tart and brightly fruity',notes:['Hibiscus tang','Apple softness','Citrus finish'],profile:[1,5,2,0],moment:'bright',format:'iced',
    intro:'Hibiscus, rosehips, dried apple and orange peel make a vivid ruby blend with a refreshing, fruit-led tang.',
    story:'Roohani is the brightest cup in the collection. Hibiscus and rosehips give it a lively tartness, balanced by mellow apple and orange peel. Its ruby colour is part of the pleasure. Pour it warm on a quiet afternoon or over plenty of ice when the day calls for refreshment.',
    ingredients:[ingredient('Hibiscus','Ruby colour and lively tang','hibiscus'),ingredient('Rosehips','A fruity, tart edge','rosehips'),ingredient('Dried apple','Mellow fruit balance','apple'),ingredient('Orange peel','A bright citrus finish','orange')],
    benefits:[['A brighter refreshment','Tart fruit notes make an expressive alternative to sugary coolers.'],['Made for ice','Brew, cool and pour over ice for a colourful afternoon drink.'],['Colour from botanicals','Hibiscus brings the ruby character to this proposed blend.']],
    helps:'A bright, tart alternative to sugary coolers.',temp:95,minutes:5,colourOfCup:'Deep ruby red',pairing:'A sunny afternoon, a picnic or a simple savoury lunch.',
    brew:'Cover the blend with hot water. Taste early for gentler tartness, then strain carefully.',
    iced:'Brew a little stronger, strain and cool before pouring over ice. Enjoy the tartness before adding sweetener.'
  }
].map(t=>({...t,kind:'Herbal infusion',caffeine:'Caffeine-free',price:299,weight:50,amount:'1–2 tsp',water:200,
  reasons:t.benefits,label:{front:[t.name,t.type+' herbal infusion',t.taste,'50 g'],storage:storageNote,designation:'Academic marketing concept · Not for sale'},
  evidence:conceptNote,caution:'Proposed recipe; check ingredients for individual sensitivities. Not a medical treatment.',
  galleryCaptions:[t.name+': '+t.type.toLowerCase()+' blend with its coordinated paper kettle.',t.ingredients.map(i=>i.name+': '+i.note.toLowerCase()).join('; ')+'.',t.benefits.map(([title])=>title).join('. ')+'.',t.time+'. '+t.taste+'. '+t.iced,'Front and back concept labels: all four ingredients, benefits, brewing, storage and 50 g weight.','Folded paperboard outside, a separate sealed inner pouch inside. Keep the outer kettle dry.']
}));
export const getTea=id=>teas.find(t=>t.id===id);
export function searchTeas(query='',category='all'){
  const words=String(query).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return teas.filter(t=>(category==='all'||t.category===category)&&words.every(w=>[t.name,t.type,t.kind,t.botanical,t.meaning,t.taste,t.caffeine,t.time,...t.notes,...t.ingredients.map(i=>i.name)].join(' ').toLowerCase().includes(w)));
}
export const validateSaved=value=>Array.isArray(value)?[...new Set(value)].filter(id=>typeof id==='string'&&getTea(id)).slice(0,6):[];
export function recommendTeas({moment='soft',caffeine='any',format='either'}={}){
  return teas.filter(t=>caffeine!=='none'||t.caffeine==='Caffeine-free').map((t,index)=>({tea:t,score:(t.moment===moment?6:0)+(format==='either'||t.format===format||t.format==='either'?2:0),index})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,2).map(x=>x.tea);
}
export const teaLink=id=>'/tea.html?tea='+encodeURIComponent(id);
export const galleryPath=(t,index=0)=>'/images/ketli-time/stories-v1/'+t.id+'-'+(galleryViews[index]||galleryViews[0]).id;
export function galleryImage(t,index,options={}){
  const view=galleryViews[index]||galleryViews[0],base=galleryPath(t,index);
  return `<span class="gallery-frame ${options.className||''}"><img src="${base}.webp" srcset="${base}-thumb.webp 240w, ${base}.webp 1200w" sizes="${options.thumbnail?'90px':'(max-width:600px) 90vw, (max-width:1100px) 45vw, 650px'}" alt="${t.name}: ${view.label.toLowerCase()}. ${t.galleryCaptions[index]||t.galleryCaptions[0]}" width="1200" height="1200" loading="${options.eager?'eager':'lazy'}" decoding="async" ${options.eager?'fetchpriority="high"':''}></span>`;
}
