'use client'
import { Button } from "@/components/ui/button";

import { useMutation, useQuery } from "convex/react"
import { api } from '../../convex/_generated/api';

const X = () => {
  const projects = useQuery(api.projects.get)
  const createProject = useMutation(api.projects.create)
  return (
    <div className='flex flex-col gap '>
      <Button  onClick={() => createProject({
        name: "New Proj123"
      })}>Add New</Button>
      {
        projects?.map((proj) => (

          <div className="border rounded p-2 " key={proj._id}>

            <p>t{proj.name}</p>
            <p>OwnerID  :{`${proj.ownerId}`} </p>
          </div>

        ))
      }
    </div>
  );
};

export default X;