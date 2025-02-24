"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  university: z.string().min(1, "University ID is required"),
  email: z.string().email("Invalid email"),
  gradDate: z.string().min(1, "Graduation date is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Error appears under confirmPassword field
});

type FormValues = z.infer<typeof formSchema>;

export default function NewAccountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const universityOptions = universities.map((uni) => {
    return (
      <option key={uni.id} value={String(uni.id)}>
        {uni.name}
      </option>
    );
  });
  

  // Fetch universities from API
  useEffect(() => {
    fetch("/api/university")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched universities:", data); // Debugging log
        const formattedUniversities = data.map((uni: { university_id: number; university_name: string }) => ({
          id: uni.university_id,
          name: uni.university_name,
        }));
        setUniversities(formattedUniversities);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching universities:", err);
        setLoading(false);
      });
  }, []);    

  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    console.log("Checking for validation errors:", errors);

    // Display a snackbar if there are validation errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix form errors before submitting!");
      console.error("Form validation failed!");
      return;
    }

    try {
      const response = await fetch("/api/new-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok) {
        toast.success("Account successfully created!");
        setMessage("Account successfully created!");
      } else {
        toast.error(`Error: ${result.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit data");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16">
      {/* Snackbar Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="pt-4 max-w-md mx-auto p-10 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Sign up for STU</h2>
        {message && <p className="text-green-600">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" {...register("firstName")} placeholder="First Name" className="w-full border p-2 rounded" />
          {errors.firstName?.message && toast.error(errors.firstName.message)}

          <input type="text" {...register("lastName")} placeholder="Last Name" className="w-full border p-2 rounded" />
          {errors.lastName?.message && toast.error(errors.lastName.message)}

          <input type="email" {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
          {errors.email?.message && toast.error(errors.email.message)}

          <input type="password" {...register("password")} placeholder="Password" className="w-full border p-2 rounded" />
          {errors.password?.message && toast.error(errors.password.message)}

          <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className="w-full border p-2 rounded" />
          {errors.confirmPassword?.message && toast.error(errors.confirmPassword.message)}

          <input type="date" {...register("gradDate")} className="w-full border p-2 rounded" />
          {errors.gradDate?.message && toast.error(errors.gradDate.message)}

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}