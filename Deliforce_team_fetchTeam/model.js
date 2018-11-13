const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const teamSchema=new Schema({
  clientId: {type: String, required: true},
  teamName: {type: String, required: true},
  notes: {type: String},
  created_at: {type: Date, default: Date.now, required: true}//recently created first purpose

},{ strite:false });


teamSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('team',teamSchema);






