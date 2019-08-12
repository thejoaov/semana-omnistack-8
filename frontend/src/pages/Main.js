import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dislike from "../assets/dislike.svg";
import itsamatch from "../assets/itsamatch.png";

import like from "../assets/like.svg";

import logo from "../assets/logo.svg";
import api, { url } from "../services/api";
import "./Main.css";
import io from "socket.io-client";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const [profile, setProfile] = useState({});
  useEffect(
    () => {
      async function loadUsers() {
        const response = await api.get("/devs", {
          headers: {
            user: match.params.id,
          },
        });

        setUsers(response.data);
      }

      loadUsers();
    },
    [match.params.id]
  );
  useEffect(
    () => {
      async function getProfile() {
        const response = await api.get("/devs/u", {
          headers: {
            user: match.params.id,
          },
        });
        setProfile(response.data);
      }
      getProfile();
    },
    [match.params.id]
  );
  useEffect(
    () => {
      const socket = io(url, {
        query: { user: match.params.id },
      });

      socket.on("match", dev => {
        setMatchDev(dev);
      });
    },
    [match.params.id]
  );

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      <div className="profile-container">
        <img
          className="profile-avatar"
          src={profile.avatar}
          alt={profile.user}
        />
        <p className="profile-name">{profile.name}</p>
        <p className="profile-username">@{profile.user}</p>
      </div>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match" />

          <img className="avatar" src={matchDev.avatar} alt="" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>
            FECHAR
          </button>
        </div>
      )}
    </div>
  );
}
