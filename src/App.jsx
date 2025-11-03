
import React, {useEffect, useState, useRef} from 'react';
import { motion } from 'framer-motion';

// Minimal but functional LifeSwap app (enhanced prototype)
// See canvas for the full expanded version.

const STATE_KEY = 'lifeswap_pro_player_state_v1';
function avatarFor(name){ return `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(name||'user')}`; }

function createInitialState(){ return { me:null, profiles:[], timelines:{}, templates:[], events:[], polls:{}, leaderboard:[], settings:{theme:'auto'} }; }

export default function LifeSwapApp(){
  const [state, setState] = useState(()=> { const raw = localStorage.getItem(STATE_KEY); return raw? JSON.parse(raw) : createInitialState(); });
  const [ui, setUi] = useState({view:'home'});
  const [profileDraft, setProfileDraft] = useState({name:'',interests:'',goals:'',personality:'Balanced'});
  const [activeTimeline, setActiveTimeline] = useState(null);

  useEffect(()=>{ localStorage.setItem(STATE_KEY, JSON.stringify(state)); }, [state]);

  function registerProfile(){
    if(!profileDraft.name) return alert('Enter a name');
    const profile = {...profileDraft, interests: profileDraft.interests.split(',').map(s=>s.trim()).filter(Boolean)};
    const timelines = {};
    const templates = [
      {id:'musician_tokyo', title:'Musician — Tokyo'},
      {id:'founder_sf', title:'Founder — San Francisco'},
      {id:'dj_berlin', title:'DJ — Berlin'}
    ];
    for(const t of templates){ const id = 'tl_'+Math.random().toString(36).slice(2,9); timelines[id] = {id, title:`${profile.name} — ${t.title}`, template:t.id, day:0, attributes:{happiness:50,wealth:50,relationships:50,fame:10}, history:[], profile}; }
    const newState = {...state, me:{id:'me_'+Math.random().toString(36).slice(2,7), profileName:profile.name, subscription:false}, profiles:[...state.profiles, profile], timelines:{...state.timelines, ...timelines}, templates};
    setState(newState); setUi({view:'gallery'});
  }

  function openTimeline(id){ setActiveTimeline(state.timelines[id]); setUi({view:'timeline'}); }

  function applyChoiceToTimeline(tlId, choiceText, accepted){
    const tl = {...state.timelines[tlId]};
    const effects = accepted ? {happiness:5,wealth:3} : {happiness:-2};
    for(const k in effects) tl.attributes[k] = Math.max(0, Math.min(100, (tl.attributes[k]||50)+effects[k]));
    tl.history = [...tl.history, {day:tl.day+1, decision:choiceText, accepted, effects, story:`${tl.profile.name} ${accepted? 'accepted' : 'declined'} ${choiceText}`}];
    tl.day++;
    const s = {...state, timelines:{...state.timelines, [tlId]:tl}};
    setState(s); setActiveTimeline(tl);
  }

  return (
    <div className="app">
      <header><h1>LifeSwap — Prototype</h1></header>
      {ui.view==='home' && (
        <div>
          <p>Welcome — create an alternate you.</p>
          <button onClick={()=>setUi({view:'setup'})}>Start</button>
        </div>
      )}

      {ui.view==='setup' && (
        <div>
          <input placeholder="Name" value={profileDraft.name} onChange={e=>setProfileDraft({...profileDraft,name:e.target.value})} />
          <input placeholder="Interests" value={profileDraft.interests} onChange={e=>setProfileDraft({...profileDraft,interests:e.target.value})} />
          <button onClick={registerProfile}>Generate Alternate Lives</button>
        </div>
      )}

      {ui.view==='gallery' && (
        <div>
          <h2>Your Lives</h2>
          <div>
            {Object.values(state.timelines).map(tl=>(
              <div key={tl.id}>
                <img src={avatarFor(tl.profile.name)} alt="avatar" width="64" />
                <div>{tl.title} — Day {tl.day}</div>
                <button onClick={()=>openTimeline(tl.id)}>Play</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {ui.view==='timeline' && activeTimeline && (
        <div>
          <h2>{activeTimeline.title}</h2>
          <div>Day {activeTimeline.day}</div>
          <div>
            <p>Choice: Try something new today</p>
            <button onClick={()=>applyChoiceToTimeline(activeTimeline.id, 'Try something new', true)}>Yes</button>
            <button onClick={()=>applyChoiceToTimeline(activeTimeline.id, 'Try something new', false)}>No</button>
          </div>
          <div>
            <h3>History</h3>
            {activeTimeline.history.map((h,i)=>(<div key={i}>{h.day}: {h.story}</div>))}
          </div>
          <button onClick={()=>setUi({view:'gallery'})}>Back</button>
        </div>
      )}
    </div>
  );
}
