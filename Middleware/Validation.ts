import Joi from "joi";

export const valiadationSchema=Joi.object({
    name:Joi.string().min(4).max(30).required(),
    email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
    password:Joi.string().min(5).max(35).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role:Joi.string().valid('Guest','Admin').required()
})

export const valiadationSchemap=Joi.object({
    platform_name:Joi.string().min(4).required(),
    description:Joi.string().min(30).required(),
})