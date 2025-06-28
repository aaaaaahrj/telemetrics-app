"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UserPen } from "lucide-react";
import React, { useState } from "react";

import profileData from "../profile-data.json";

export default function Page() {
  const [form, setForm] = useState({
    firstName: profileData[0]?.FirstName || "",
    lastName: profileData[0]?.LastName || "",
    email: profileData[0]?.Email || "",
    password: profileData[0]?.Password || "",
    phoneNumber: profileData[0]?.ContactNumber || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleButtonClick = () => {
    if (isEditing) {
      // Here you can handle the update logic (e.g., API call)
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-col'>
                <h1 className='font-bold text-lg'>Account Information</h1>
                <p className='text-muted-foreground'>
                  This is your account information. You can update your profile
                  details here.
                </p>
              </div>
              <Button
                variant='outline'
                className={`${
                  isEditing
                    ? "bg-main-orange text-white hover:bg-main-orange-dark"
                    : "bg-white hover:bg-main-orange hover:text-white"
                }`}
                onClick={handleButtonClick}
              >
                <UserPen />
                {isEditing ? "Update Profile" : "Edit Profile"}
              </Button>
            </div>
            <div className='flex flex-col w-full gap-2 mt-4'>
              <div className='gap-4 grid grid-cols-4 max-w-lg'>
                <div className='flex flex-col gap-2 col-span-2'>
                  <Label htmlFor='firstName' className='text-muted-foreground'>
                    First Name
                  </Label>
                  <Input
                    type='text'
                    id='firstName'
                    placeholder='First Name'
                    value={form.firstName}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='flex flex-col gap-2 col-span-2'>
                  <Label htmlFor='lastName' className='text-muted-foreground'>
                    Last Name
                  </Label>
                  <Input
                    type='text'
                    id='lastName'
                    placeholder='Last Name'
                    value={form.lastName}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='flex flex-col gap-2 col-span-2'>
                  <Label htmlFor='email' className='text-muted-foreground'>
                    Email
                  </Label>
                  <Input
                    type='email'
                    id='email'
                    placeholder='example@techadvise.ph'
                    value={form.email}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='flex flex-col gap-2 col-span-2'>
                  <Label htmlFor='password' className='text-muted-foreground'>
                    Password
                  </Label>
                  <Input
                    type='password'
                    id='password'
                    placeholder='Input password'
                    value={form.password}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='flex flex-col gap-2 col-span-2'>
                  <Label
                    htmlFor='phoneNumber'
                    className='text-muted-foreground'
                  >
                    Phone Number
                  </Label>
                  <Input
                    type='tel'
                    id='phoneNumber'
                    placeholder='+63'
                    value={form.phoneNumber}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
