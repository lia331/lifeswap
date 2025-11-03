const express = require('express'); const cors = require('cors'); const app = express(); app.use(cors()); app.use(express.json());
let state = {timelines:{}, polls:{}, leaderboard:[]};
app.get('/health', (req,res)=> res.json({ok:true}));
app.post('/ai/generate', (req,res)=>{ const {profile, timeline, choice, accepted} = req.body; res.json({story: `Mock AI story for ${profile?.name || 'You'} - ${choice}`}); });
app.get('/leaderboard', (req,res)=> res.json(state.leaderboard));
app.post('/polls', (req,res)=>{ const id = 'p_'+Math.random().toString(36).slice(2,8); state.polls[id] = {...req.body, id, votes: Array(req.body.options.length).fill(0)}; res.json(state.polls[id]); });
app.post('/polls/:id/vote', (req,res)=>{ const {choice} = req.body; state.polls[req.params.id].votes[choice]++; res.json(state.polls[req.params.id]); });
const port = process.env.PORT || 4000; app.listen(port, ()=> console.log('Mock backend running on', port));