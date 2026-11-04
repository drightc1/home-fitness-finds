const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const code=readFileSync('assets/click-tracking.js','utf8');
function boot(consent){
 const handlers={},sent=[],elements={},scripts=[];
 const document={readyState:'complete',referrer:'',head:{appendChild:s=>scripts.push(s)},body:{appendChild:s=>{elements[s.id]=s}},querySelector:()=>({appendChild(){}}),getElementById:id=>elements[id],addEventListener:(n,f)=>handlers[n]=f,createElement:()=>({setAttribute(){},style:{},addEventListener(n,f){this[n]=f},remove(){delete elements[this.id]}})};
 const window={};const location={origin:'https://fitnessfindshq.com',pathname:'/',href:'https://fitnessfindshq.com/?secret=no',reload(){}};
 const ctx={window,document,location,localStorage:{getItem:()=>consent,setItem(){}},URL};vm.runInNewContext(code,ctx);
 window.gtag=(...args)=>sent.push(args);
 return {window,handlers,sent,scripts};
}
let t=boot('yes');assert.equal(t.scripts.length,1);assert.match(t.scripts[0].src,/G-XPS7L21C89$/);
function fire(href,type='click',button=0){t.handlers[type]({type,button,defaultPrevented:false,target:{closest:()=>({href})}})}
fire('https://www.amazon.com/dp/B01LR5RG08?tag=homefitnes055-20');assert.equal(t.sent[0][1],'amazon_click');assert.equal(t.sent[0][2].product_id,'B01LR5RG08');assert.ok(!JSON.stringify(t.sent).includes('tag='));
fire('/guides/adjustable-dumbbells.html?utm_source=pinterest');assert.equal(t.sent[1][1],'guide_click');assert.equal(t.sent[1][2].destination_path,'/guides/adjustable-dumbbells');
for(const href of ['javascript:alert(1)','https://amazon.com.evil.com/dp/B01LR5RG08','/#guides','/privacy.html'])fire(href);
assert.equal(t.sent.length,2);
fire('https://www.amazon.com/dp/B01LR5RG08','auxclick',1);assert.equal(t.sent.length,3);
fire('https://www.amazon.com/dp/B01LR5RG08','auxclick',2);assert.equal(t.sent.length,3);
t=boot('no');fire('https://www.amazon.com/dp/B01LR5RG08');assert.equal(t.sent.length,0);assert.equal(t.scripts.length,0);
t=boot(null);assert.equal(t.scripts.length,0);
console.log('PASS: guide/Amazon events, product IDs, no URL queries, hostname checks, middle clicks, no analytics before consent or after decline.');
