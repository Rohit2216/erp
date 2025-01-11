var moment = require('moment');
const { con, makeDb } = require("../db");
const db = makeDb();

async function generatePanelIdForAdmin(role_id, userName){    
    const roleData =  await db.query(`SELECT name FROM roles WHERE id='${role_id}'`);
    if(roleData.length>0){
        const str = roleData[0].name;
        const initials = str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');      
        var firstFourLetters = initials+"-"+userName.substr(0, 4).toUpperCase();
        return firstFourLetters+String(1).padStart(5, '0');
    }else{
        return "";  
    }
}

async function generatePanelIdForUser(user_type, user_id ){    
    
    const adminPanelData =  await db.query(`SELECT panel_id FROM admins WHERE user_type='${user_type}' AND id='${user_id}'`);
    const panel_id =  adminPanelData[0].panel_id; 
    
    const secondPart = panel_id.slice(-5);
    const firstPart = panel_id.slice(0, -5);
    const userPanelData = await db.query(`SELECT panel_id FROM users WHERE panel_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`);
    if(userPanelData.length>0){
        const userPanelId = userPanelData[0].panel_id;
        const userSecondPart = userPanelId.slice(-5);
        const userFirstPart = userPanelId.slice(0, -5);      
        return userFirstPart+String(parseInt(userSecondPart) + 1).padStart(5, '0');
    }else{        
        return firstPart+String(parseInt(secondPart) + 1).padStart(5, '0');
    }
}

async function generateSuperAdminEmpId(){

    const adminPanelData =  await db.query(`SELECT employee_id FROM admins WHERE user_type='1' AND id='1'`);
    const panel_id =  adminPanelData[0].employee_id;   
    const secondPart = panel_id.slice(-4);
    const firstPart = panel_id.slice(0, -4);
    const userData = await db.query(`SELECT employee_id FROM users WHERE employee_id LIKE '%${firstPart}%' ORDER BY id DESC LIMIT 1`);   
    if(userData.length > 0){
        const employee_id =  userData[0].employee_id; 
        const userSecondPart = employee_id.slice(-4);
        const userFirstPart = employee_id.slice(0, -4);      
        return userFirstPart+String(parseInt(userSecondPart) + 1).padStart(4, '0');
    }else{
        return firstPart+String(parseInt(secondPart) + 1).padStart(4, '0');
    }             
}

module.exports = { generatePanelIdForAdmin, generatePanelIdForUser, generateSuperAdminEmpId }