import apiRequest from "../../../services/api";
import "./style.css";
import { Link } from "react-router-dom";
import jwt from 'jwt-decode'
import { useEffect, useState, useContext } from "react";

export default function SalasPublicas() {
  const [chats, setChats] = useState([])
  const [chatsUser, setChatsUser] = useState([])
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [token, setToken] = useState('');
  useEffect(() => {
    setToken(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
  }, [])


  const getUsuario = () => {
    apiRequest
      .get(`/usuario/${jwt(token).secret.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setUsuarioSelecionado(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }


  const getChats = async () => {
    await apiRequest
      .get("/chat", {
        headers: {
          Authorization: "bearer " + token
        }
      })
      .then(response => {
        setChats((response.data))
      })
      .catch(err => {console.log(err)})
  }

  useEffect(() => {
    if(token){
      getUsuario()
    }
  }, [token])

  useEffect(() => {
    if(token) {
      console.log(usuarioSelecionado)
      const array = usuarioSelecionado.chats.map(e => {
        return e.idChat
      })
      setChatsUser(array)
      getChats()
    }
  }, [usuarioSelecionado])

  useEffect(() => {
    if(chats && token){
      console.log(chats)
    }
  }, [chats])


  const joinUserInstance = async (idChat) => {
    const data = {
      idChat: idChat,
      idUsuario: jwt(token).secret.id
    }
    await apiRequest
      .post("/chat/joinUser", data, {
        headers: {Authorization: "bearer " + token}
      })
      .then(response => {

      })
      .catch(err => {console.log(err)})
  }


  return token && usuarioSelecionado && (




    <div className="containerSalaPrincipal">
      <div className="salaPrincipal">
        {chats.map((data, index) => {
          return !chatsUser.includes(data._id) && (
            <div className="sala" style={{width: '50%'}} key={index}>
              <div>{data.nome}</div>
              <div>{data.tema}</div>
              <div>
              <Link
                className="botaoChatPublico"
                to="/chat"
                onClick={(e) => {
                  e.preventDefault();
                  joinUserInstance(data._id)
                  setTimeout(() => {
                    window.location.href = "/chat";
                  }, 500);
                }}
              >
                Juntar-se ao grupo
              </Link>
              </div>
          </div>
          );
        })}
      </div>
    </div>

  );
}
