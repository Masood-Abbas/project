const express=require(`express`)


const router=express.Router()

const permissionRoute=require('./permission')
const titleRoute=require('./title/title')
const roleRoute=require('./roles/roles')
const instrumentRouter=require('./Instrument/Instrument')
const userRouter=require(`./user/user`)
const patientRouter=require(`./Patient/Patient`)

router.use(`/user`,userRouter)
router.use('/permission', permissionRoute);
router.use('/titles',titleRoute)
router.use('/roles',roleRoute)
router.use(`/Instrument`,instrumentRouter)
router.use(`/patient`,patientRouter)



module.exports=router;
