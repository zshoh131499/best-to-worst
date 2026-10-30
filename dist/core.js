export const TIERS = ['S-TIER','GREAT','SOLID','MEH','NOPE'];
export const COLORS = ['#ec8c77','#eac578','#e6e7a1','#9ac7b2','#91b9cf'];
export const DECKS = {
  'A little of everything':['Hot pot','Rainy days','Social media','Horror movies','Cilantro','Camping','Bubble tea','Early mornings','Cats','Birthdays','Solo travel','Working out','Phone calls','Karaoke','Waiting in line','Roller coasters','Staying in','Unboxing','New Year’s Eve','Cartoons','Spontaneous trips','Escape rooms','Sunrises','Grocery shopping','Dad jokes','The beach','Cooking','Puzzles','Concerts','Naps','Board games','Museum visits','Taking photos','Spicy food','Chocolate','Road trips','City walks','Podcasts','Tidying up','Surprise parties'],
  'Food for thought':['Hot pot','Cilantro','Durian','Pizza','Bubble tea','Sushi','Spicy soup','Iced coffee','Cake','Snail noodles','Barbecue','Pickles','French fries','Salad','Stinky tofu','Chocolate','Vanilla ice cream','Noodles','Dumplings','Pineapple pizza','Soup dumplings','Matcha','Coconut water','Fried chicken','Oysters'],
  'Everyday things':['Early mornings','Rainy days','Weekend work','Solo travel','Dog walks','Working out','Camping','Cooking','Cleaning','Naps','Traffic','New clothes','Grocery shopping','Flying','Moving house','Sunrises','Sunsets','Phone calls','Voice notes','Journaling','Subway rides','Cycling','Walking','Making plans','Last-minute plans'],
  'Good times':['Cartoons','Horror movies','Board games','Karaoke','Concerts','Escape rooms','Roller coasters','Stand-up comedy','Puzzles','Watching sports','Gaming streams','Museums','Photography','Short videos','Reading fiction','Cat cafés','Music festivals','New Year’s Eve','Unboxing','Surprise parties','Bookstores','Reality TV','Murder mysteries','Fishing','Skiing']
};
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function swap(order,from,to){const next=[...order];if(from>=0&&to>=0&&from<next.length&&to<next.length)[next[from],next[to]]=[next[to],next[from]];return next;}
export function evaluate(secret,guess,rankConfidence,guessConfidence){
 if(secret.length!==5||guess.length!==5||new Set(secret).size!==5||new Set(guess).size!==5||guess.some(x=>!secret.includes(x)))throw new Error('Both rankings must contain the same five unique cards');
 if([rankConfidence,guessConfidence].some(x=>!Number.isFinite(x)||x<0||x>100))throw new Error('Confidence must be between 0 and 100');
 const matches=guess.map((id,i)=>id===secret[i]);const hits=matches.filter(Boolean).length;const accuracy=hits/5;
 const calibration=1-(Math.abs(rankConfidence/100-accuracy)+Math.abs(guessConfidence/100-accuracy))/2;
 return {matches,hits,misses:5-hits,accuracy,calibration,index:Math.round(40*accuracy+60*calibration)};
}
export function totals(history){return history.reduce((a,r)=>({team:a.team+r.hits,game:a.game+r.misses}),{team:0,game:0});}
export function outcome(history,players){if(history.length<players)return 'continue';const t=totals(history);return t.team===t.game?'overtime':t.team>t.game?'win':'lose';}
