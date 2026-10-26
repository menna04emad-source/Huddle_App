import * as zod from "zod";



export const Registerschema = zod.object({
  name : zod.string().nonempty("name is required").min(3,"min length is 3").max(10 , "max length is 10"),
email : zod.email().nonempty("email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "invalid email"),
dateOfBirth : zod.string().nonempty("date is required").refine((dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  const minDate = new Date(
    today.getFullYear() - 10,
    today.getMonth(),
    today.getDate()
  );

  return birthDate <= minDate;
}, "You must be at least 10 years old"),

gender : zod.enum(["male","female"]),
password : zod.string().nonempty("password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
rePassword : zod.string().nonempty("repassword is required"),
}).refine((obj)=> {
if(obj.password === obj.rePassword){
return true
}else {
  return false
}
},{
  path : ["rePassword"],
  error : "password and rePassword not match"
});

export type RegisterschemaType = zod.infer<typeof Registerschema>
/////Login schema/////
export const Loginschema = zod.object({
 
email : zod.email().nonempty("email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "invalid email"),

password : zod.string().nonempty("password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),

})

export type LoginschemaType = zod.infer<typeof Loginschema>

