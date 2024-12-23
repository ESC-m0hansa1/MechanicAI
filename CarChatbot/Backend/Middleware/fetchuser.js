var jwt = require('jsonwebtoken');
const secret  = "This is a secret";

const fetchuser = async (req,res,next)=>
{
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send.json({error:"please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,secret);

        //AS U KNOW IN AUTH-TOKEN WE HAVE DATA WHICH HAS USERID IN A OBJECT CALLED USER ,SO BASICALLY AFTER VERIFYING AUTH-TOKEN
        //IT SETS THE REQUESTED USEr TO THE CURRENT USER VERIFIED AS PER AUTH-TOKEN AND ACCORDINGLY WE CAN DO THEINGS WITH THAT USER
        //LIKE FETCHING HIS ALL NOTES , ADDING NOTES ETC...
        req.user = data.user;
        // console.log(req.user);
        //THIS CONSOLE LOG HAS AN ID EXAMPLE {{ id: '66538178bbb00ee3168efbfa' }} -->THIS IS THE ID OF REQUESTED USER AFTER AUTH-TOKEN VERIFICATION
        next();
    }
    catch (error) 
    {
        res.status(401).send("please authenticate using a valid token")
    }
}
module.exports = fetchuser