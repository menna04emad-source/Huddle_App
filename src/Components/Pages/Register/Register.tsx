import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import {
  Registerschema,
  type RegisterschemaType,
} from "../../../Schemas/auth.schema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [apiError, setapiError] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setisLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterschemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "female",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(Registerschema),
    mode: "onSubmit",
  });

  const handleRegister: SubmitHandler<RegisterschemaType> = async (
    values
  ) => {
    setisLoading(true);
    setapiError(undefined);

    try {
      const res = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Registration successful!"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const message =
          res.data.message || "Registration failed.";

        setapiError(message);
        toast.error(message);
      }
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.errors;

        if (typeof errorMessage === "string") {
          message = errorMessage;
        } else if (errorMessage) {
          message = JSON.stringify(errorMessage);
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setapiError(message);
      toast.error(message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-3xl font-bold">
        Register Now
      </h1>

      {apiError && (
        <p className="mx-auto w-[300px] rounded-sm bg-red-600 p-2 text-center font-bold text-white">
          {apiError}
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="mx-auto my-5 max-w-md space-y-4"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full rounded border p-2"
          />
          {errors.name && (
            <p className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded border p-2"
          />
          {errors.email && (
            <p className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Date of birth */}
        <div>
          <label htmlFor="dateOfBirth" className="mb-1 block">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
            className="w-full rounded border p-2"
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <fieldset>
          <legend className="mb-1">Gender</legend>

          <label className="mr-4 inline-flex items-center gap-2">
            <input
              type="radio"
              value="male"
              {...register("gender")}
            />
            Male
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="female"
              {...register("gender")}
            />
            Female
          </label>

          {errors.gender && (
            <p className="text-sm text-red-600">
              {errors.gender.message}
            </p>
          )}
        </fieldset>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded border p-2"
          />
          {errors.password && (
            <p className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="rePassword" className="mb-1 block">
            Confirm Password
          </label>
          <input
            id="rePassword"
            type="password"
            {...register("rePassword")}
            className="w-full rounded border p-2"
          />
          {errors.rePassword && (
            <p className="text-sm text-red-600">
              {errors.rePassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-emerald-500 p-2 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Register"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
}

