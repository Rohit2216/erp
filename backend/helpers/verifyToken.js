const jwt = require('jsonwebtoken');
const {getAllStoredActiveRoles, getAndCheckModulePermissionForAction} = require('./general');

const verifySuperAdminToken = async (req, res, next) => {
    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Super Admin not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.SUPER_ADMIN_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyContractorToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({ status: false,  message: "Contractor not verified" });            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, decoded) => {

                if(err) return res.status(403).json({status: false, message: err.message});
                
                // get all stored active roles and then check for user type
                const allStoredActiveRoles = await getAllStoredActiveRoles();
                if(allStoredActiveRoles.status)
                {
                    // Check if userTypeId exists in the list of role IDs
                    const userRoleExists = allStoredActiveRoles.data.some(role => role.id == decoded.user_type);

                    if(userRoleExists)
                    {
                        req.user = decoded
                        next();
                        return;
                    }
                    else
                    {
                        return res.status(403).json({status: false, message: "Forbidden access"})
                    }
                }
                return res.status(403).json({status: false, message: "Forbidden access"});
               
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyDealerToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Dealer not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.DEALER_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyEnergyCompanyToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("token",token)
        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Energy company admin not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                console.log("decoded.user_type",decoded.user_type)
                if(decoded.user_type!= process.env.ENERGY_COMPANY_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifySubUserToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Sub user not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});

                if(decoded.user_type != process.env.SUB_USER_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }

}

const permissionCheck  = async(req, res, next) => {
    try {
        const role_id = req.user.user_type;
        const module_id =  req.query.module_id;
        const sub_module_id = req.query.sub_module_id;
        const module_of_sub_module_id = req.query.module_of_sub_module_id ?? null;
        const action = req.query.action;
        if(role_id == process.env.SUPER_ADMIN_ROLE_ID)
        {
            return next();
        }
        const checkPermissionAction = await getAndCheckModulePermissionForAction(module_id, sub_module_id, module_of_sub_module_id, role_id, action);
        if(checkPermissionAction.length > 0)
        {
            const dbData = checkPermissionAction[0];
           if(dbData[action] > 0)
           {
                next();
           }
           else
            {
                return res.status(403).json({
                    status: false,
                    message: "Oops! You lack permission for this action."
                });
            }
        }
        else
        {
            return res.status(403).json({
                status: false,
                message: "Oops! You lack permission for this action."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {verifySuperAdminToken, verifyContractorToken, verifyDealerToken, verifyEnergyCompanyToken, verifySubUserToken, permissionCheck}