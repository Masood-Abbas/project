const express=require(`express`)


const router=express.Router()

const permissionRoute=require('./permission')
const titleRoute=require('./title/title')
const roleRoute=require('./roles/roles')
const instrumentRouter=require('./Instrument/Instrument')
const userRouter=require(`./user/user`)
const patientRouter=require(`./Patient/Patient`)
// import form router
const bloodRouter=require(`./forms/bloodtest`)
const urineRouter=require(`./forms/urineTest`)
const liverRouter=require(`./forms/liverTest`)

router.use(`/user`,userRouter)
router.use('/permission', permissionRoute);
router.use('/titles',titleRoute)
router.use('/role',roleRoute)
router.use(`/Instrument`,instrumentRouter)
router.use(`/patient`,patientRouter)
// Form router
router.use(`/bloodreport`,bloodRouter)
router.use(`/urinereport`,urineRouter)
router.use(`/liverreport`,liverRouter)



module.exports=router;
