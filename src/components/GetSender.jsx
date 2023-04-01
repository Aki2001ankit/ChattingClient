export const GetSender =(loggeduser,users)=>{
    return users?.[0]?._id ===loggeduser?._id ? users?.[1]:users?.[0]
};