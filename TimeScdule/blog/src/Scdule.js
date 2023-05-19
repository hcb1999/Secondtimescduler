import Fab from '@material-ui/core/Fab';           
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import React, { useEffect , useState } from 'react'
import './App.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Header from "./Header";
import Openscdule from "./Openscdule";
import Todohome from './Todohome';
import Modal from './Modal';


//**프로그램 실행방법 **//
//밑에 보이는 명령어 입력할수잇는 터미널창에서 yarn dev를 입력하면 실행됨 dev는 일종의 내가 지정한 명령어 서버와 프론트엔드를 동시에 접속할수있게만듬
//실행하면 서버와 프론트엔드가 열리게됨 보이는 화면이 프론트엔드, 서버는 위 주소에서 5000/api/scdule을 하면 이동가능


const FullCalendarApp = () => { //풀캘린더 라이브러리 사용
const location=useLocation();
const {id,name} = location.state;
const[scdule, setscdule] = useState({}); // 서버에서 데이터를 가져와 밑에 fullcalender모듈에서 event부분에 입력하면 화면에 일정이 나옴
const[friend,setfriend]= useState([{}]);
const[category,setcategory]= useState([{}]);
const [toggled, setToggled] = useState(false);
  const [test, settest] = useState(2);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [findid, setfindid] = useState('');
  const [status, setstatus] = useState('');

  const addfriend = () => {
   axios.post("http://localhost:5000/api/AddFriend",{
   fid:findid,   
   id:id,
   date:16,

   }).then(()=>{
    alert('등록 완료!');
    navigate(0);
   });
}
const onChange = (event) =>{
   setfindid(event.target.value);
}
const onClick = () =>{
    axios.post('http://localhost:5000/api/test', {
        id:findid,
        
      }).then((response)=>{

          if(response.data.message){
              setstatus(response.data.message);
          } else{
              setstatus(response.data[0].name);
          }
       console.log(response);
      })
  };
  
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

const handleToggleSidebar = (value) => {
  setToggled(value);
};

/*for(let i =0; i<friend.length; i++){
  <div><span>{friend[i].name}</span></div>
  console.log(friend[i].name);
  */

  function Friend({ f }) { //map함수를 이용해서 friend의 배열을 차례로 출력한다
    return (
      
        <MenuItem>{f.name}</MenuItem> 
      
    );
  }
function Category({c}){
  return (
    <MenuItem>{c.category}</MenuItem> 
    
  );
}
console.log(id);

useEffect ( ()=> {
  axios.post('http://localhost:5000/api/scdule',{
  pcode:id,
  })// 서버를 호출하고 호출한 서버에서 데이터를 가져와 setscdule 에 넣어줌 
  .then(res =>{
    
    console.log(res.data);
    console.log(res.data[0]);
    console.log(res.data[1]);


    
    setscdule(res.data[0]);
        setfriend(res.data[1]);

    console.log(res.data[0]);
  })
}, []);

    console.log(friend);
   
const navigate= useNavigate();



const openupload = () =>{
  navigate('/upload',{
    state: {
        id:id,
        name:name
    },
});
}
const AddFriend = () => {
  navigate('/AddFriend',{
    state: {
      id:id,
    }
  });
}
const AddCategory = () => {
  navigate('/AddCategory',{
    state: {
      id:id,
    }
  });
  }
const menuList = friend.map((frienda) => (<li class="friendlist" key={frienda.id}>{frienda.name}</li>));

  return (
    <div>    
      <div id ="header" style={{display:'flex'}}>
        <div class='section-left'>
          
          <div class="Header-logo">
            캘린더
          </div>
          <div class="section-left-content">
            친구목록 <button  className="todoapp__inputbox-add-btn" onClick={openModal}>추가</button>
      <Modal open={modalOpen} close={closeModal} header="친구 검색">
              <div>
        
          <TextField  name='find' value ={findid} onChange ={onChange} label ="아이디로 찾기" /> 
          <button className='Container_submit_button'  onClick={onClick}>검색</button>
          <div>{status} <button className='Container_submit_button' onClick ={addfriend}>추가</button></div> 
   </div>
            </Modal>
                 <ul>
                {menuList}
            </ul>    
          </div>
          <div>
            할일목록
          </div>
<Todohome/>

         </div>

     
          
          <div style={{width:'100vw'}}>
      <FullCalendar //풀캘린더 모듈 함수
      
      
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ // 화면 중앙 상단 헤더부분 center 순서대로 월 주 일
          center: 'dayGridMonth,timeGridWeek,timeGridDay', 
        }}
        events={scdule} // 일정을 달력위에 뿌려줌
        eventColor="red"
        
        nowIndicator 
        height={'100vh'}
        dateClick={(info) => console.log(info.event.start)} //날짜 클릭시 나오는 함수 
        eventClick={(info) => {
          axios.post('http://localhost:5000/api/selectscdule', {
          scode: info.event.extendedProps.scode
        }).then((response)=>{
          navigate('/openscdule',{
            state: { 
                 scode: info.event.extendedProps.scode,
                 pcode:response.data[0].pcode,
                 ccode:response.data[0].ccode,
                 title:response.data[0].title,
                 start:response.data[0].start,
                 end:response.data[0].end,
                 people:response.data[0].withpeo,
                 place: response.data[0].place,
                 alarm:response.data[0].alarm,
                 test: friend
            },
          });
        })
        }
    }
        
        locale = 'ko' // 한국어버전
      />
      </div>
    <div className='addbtn'>
        <Fab onClick={openupload} color="primary" aria-label="add" variant="extended" >
          <AddIcon onClick={openupload}/>일정추가
        </Fab>
        </div>

    </div>
    </div>
  );
  

      }
      


export default FullCalendarApp;