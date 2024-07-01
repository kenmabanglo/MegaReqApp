import { ResponseCode } from "src/app/core/enum/responsecode";

export class ResponseModel {
    responseCode :ResponseCode=ResponseCode.NotSet;
    responseMessage:string="";
    dataSet:any;
}