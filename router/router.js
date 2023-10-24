const express=require(`express`)
const auth=require(`../middleware/auth`)

const router=express.Router()

const permissionRoute=require('./permission')
const titleRoute=require('./title/title')
const roleRoute=require('./roles/roles')
const instrumentRouter=require('./Instrument/Instrument')
const userRouter=require(`./user/user`)
const patientRouter=require(`./Patient/Patient`)
// import form 
const bloodRouter=require(`./forms/bloodtest`)
const urineRouter=require(`./forms/urineTest`)
const liverRouter=require(`./forms/liverTest`)
const bloodGlucoseRouter=require(`./forms/bloodGlucoseTest`)
const lipidProfileTestRouter=require(`./forms/lipidProfileTest`)
const deletePdfRouter=require(`./deletePdf/index`)


router.use(`/user`,userRouter)
router.use('/permission',auth, permissionRoute);
router.use('/titles',auth,titleRoute)
router.use('/role',auth,roleRoute)
router.use(`/Instrument`,auth,instrumentRouter)
router.use(`/patient`,patientRouter)
// Form router
router.use(`/bloodreport`,bloodRouter)
router.use(`/urinereport`,urineRouter)
router.use(`/liverreport`,liverRouter)
router.use(`/glucosereport`,bloodGlucoseRouter)
router.use(`/lipidreport`,lipidProfileTestRouter)
router.use(`/deletePdf`,deletePdfRouter)



module.exports=router;
