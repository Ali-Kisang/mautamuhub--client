import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import TinderCard from "react-tinder-card";

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(()=>{ (async()=>{
    const res = await api.get("/users/all");
    setUsers(res.data);
  })(); },[]);

  const handleSwipe = (dir, user)=>{
    if(dir === "right") {
      console.log("Swiped Right on", user.username);
    }
  };

  return (
    <div className="cardContainer">
      {users.map((u)=>
        <TinderCard key={u._id} onSwipe={(dir)=>handleSwipe(dir,u)}>
          <div className="card" style={{backgroundImage:`url(${u.photos[0]})`}}>
            <h3>{u.username}</h3>
          </div>
        </TinderCard>
      )}
    </div>
  );
}
