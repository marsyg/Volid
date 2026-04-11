import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/lib/utils'
import { SparkleIcon } from 'lucide-react'
import { Poppins } from 'next/font/google'
import { FaGithub } from 'react-icons/fa'
import { useCreateProjects } from '../hooks/use-projects'
import {
    adjectives, animals, uniqueNamesGenerator, colors
} from 'unique-names-generator'
import { ProjectList } from './project-list'

import { ProjectCommandDialog } from './projects-command-dialog'
import { useState } from 'react'
import { set } from 'zod/v3'

const font = Poppins({

    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})


export const ProjectView = () => {
    const [commandDialogOpen, setCommandDialogOpen] = useState(false);
    const createProject = useCreateProjects()
    return (

        <>
            <ProjectCommandDialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen} />
          <div className='min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16'>
              <div className='w-full  max-w-sum mx-auto flex flex-auto gap-4 items-center'>
                  <div className=' flex flex-center gap-2 w-full group/logo'>
                      <img src="/vercel.svg" alt="volid" className='size-[32px] md:size-[46px]' />
                      <h1 className={cn("text-4xl md:text-5xl font-semibold", font.className)}>
                          Volid
                      </h1>
  
                  </div>
                  <div className=' flex flex-col gap-4  w-full'>
                      <div className='grid grid-cols-2 gap-2'>
                          <Button
                              variant="outline"
                              onClick={() => {
  
                                  const projectName = uniqueNamesGenerator({
                                      dictionaries: [adjectives, animals, colors],
                                      separator: '-',
                                      length: 3
                                  })
                                  createProject({
                                      name: projectName
                                  })
                              }}
                              className='h-full items-start justify-start p-4  bg-background border  flex  flex-col gap-6  rounded-none '
                          >
                              <div className='flex items-center justify-between w-full'>
                                  <SparkleIcon ></SparkleIcon>
                                  <Kbd className='bg-accent border '>
                                      J
                                  </Kbd>
  
                              </div>
                              <div>
                                  <span>
                                      New Proj
                                  </span>
                              </div>
  
  
                          </Button>
                          <Button
                              variant="outline"
                              onClick={() => { }}
                              className='h-full items-start justify-start p-4  bg-background border  flex  flex-col gap-6  rounded-none '
                          >
                              <div className='flex items-center justify-between w-full'>
                                  <FaGithub ></FaGithub>
                                  <Kbd className='bg-accent border '>
                                      I
                                  </Kbd>
  
                              </div>
                              <div>
                                  <span>
                                      Import
                                  </span>
                              </div>
  
                          </Button>
                      </div>
  
                      <ProjectList onViewAll={() => { setCommandDialogOpen(true)}} />
                  </div>
  
              </div>
  
  
          </div>
       </>
    )
}