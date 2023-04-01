import React,{useState} from 'react'

export const IsSenderLogin=(message,user,i)=>{
    if(message?.sender?._id === user._id){
        return true;
    }
    return false;
}

export const UserIndex =(message)=>{
    const senderid = message?.sender?._id;
    const users = message?.chat?.users;
    for(let i =0; i<users?.length; i++){
        if(users?.[i]=== senderid){
            return i;
        } 
    }
    return users?.length;
}

export const IsNameVisible =(message,m,user,index)=>{
    if(m?.chat?.isGroupChat === false) return false;
    if(m?.sender?._id === user._id) return false;
    if(index ===0) return true;
    if(message?.[index-1]?.sender?._id ===m?.sender?._id) return false;
    return true;

}
export const MakeCapital =(str)=>{
    if(str==="") return "";
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);

}
export const CutString =(name, str)=>{
    if(str === "") return "";
    const newstr = name+" : "+str;
    if(newstr.length <= 40) return str;
    const namestr =name+" : ";
    return str.slice(0,40-namestr.length)+"...";
    
}

export const UniqueNotification =(notification)=>{
    const [Unique, setUnique] = useState([])
    if(notification?.length === 0 || notification?.length ===1) return notification;
    setUnique([...Unique, notification?.[0]]);
    var length =notification?.length;
    for(var i =1; i<length; i++){
        if (!Unique.find((c) => c._id === notification?.[i]?._id)) {
        
        setUnique([...Unique, notification?.[i]]);
      }
    }
    return Unique

    
}

export const GetDateAndTime =(time)=>{
    if(time ==="")return;
    var index ;
    for(var i=0 ;i<time.length; i++){
        if(time[i]=='T'){
            index =i;
            break;
        }
    }
    var Date =time.slice(0,index);
    var Time =time.slice(index+1,index+6);
    var hr = parseInt(Time.slice(0,2));
    var min = Time.slice(3,5)
    var suff =" AM";
    if(hr>=13){
        hr =hr-12;
        suff =" PM"
    }
    if(hr === 0){
        hr=12;
    }
    Time = hr.toString()+":"+min+suff
    var date = Date.slice(8);
    var mon =Date.slice(5,7);
    var year =Date.slice(0,4);
    mon = parseInt(mon)
   var month;
   if(mon ===1){month="Jan"}
   else if(mon ===2){month="Feb"}
   else if(mon ===3){month="March"}
   else if(mon ===4){month="April"}
   else if(mon ===5){month="May"}
   else if(mon ===6){month="June"}
   else if(mon ===7){month="July"}
   else if(mon ===8){month="Aug"}
   else if(mon ===9){month="Sep"}
   else if(mon ===10){month="Oct"}
   else if(mon ===11){month="Nov"}
   else {month="Dec"}
   var prevdate ="null";
   
   
   var date =date+" "+month+" "+year
   if(date !== prevdate){prevdate=date}
 
const data ={date:date,time:Time,samedate:prevdate}
    return data;

}