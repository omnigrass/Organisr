'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require("lodash");

var GroupSchema = new Schema({
  _id:{
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  icon: {
    type: String
  },
  link: {
    type: String
  }
});

GroupSchema.statics.register = function (opts,callback){
  var self = this;
  var data = _.cloneDeep(opts);
  Object.assign(data,{_id:data.id});

  self.findOne({_id:data._id},(findErr,group)=>{
    if (findErr) {
      callback(findErr);
    } else if(group){
      callback(findErr,group);
    }else{
      self.model("Group").create(data,(createErr,newGroup)=>{
        if(createErr){
          return callback(createErr,null);
        }
        callback(createErr,newGroup);
      });
    }
  });
};

GroupSchema.statics.findGroup = function(groupID,callback){
  var self = this;
  self.model("Group").find({_id:groupID},(err,group)=>{
    if(err){
      return callback(err,null);
    }
    callback(err,group);
  });
};

GroupSchema.statics.getAssociatedTrainningSessions = function(ids,callback){
  var self = this;
  self.find({_id:{$in:ids}},(groupErr,groups)=>{
    if(groupErr)callback(groupErr,null);
    callback(groupErr,groups);
  });
};
module.exports = mongoose.model('Group', GroupSchema);
