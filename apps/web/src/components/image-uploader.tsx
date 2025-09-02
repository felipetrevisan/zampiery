'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nathy/shared/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@nathy/shared/ui/form'
import { Input } from '@nathy/shared/ui/input'
import { ImagePlus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const ImageUploader: React.FC = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>('')

  const formSchema = z.object({
    image: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, 'Please upload an image'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      image: new File([''], 'filename'),
    },
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader()
      try {
        reader.onload = () => setPreview(reader.result)
        reader.readAsDataURL(acceptedFiles[0])
        form.setValue('image', acceptedFiles[0])
        form.clearErrors('image')
      } catch (error) {
        setPreview(null)
        form.resetField('image')
      }
    },
    [form],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    toast.success(`Image uploaded successfully 🎉 ${values.image.name}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto md:w-1/2">
              <FormLabel className={`${fileRejections.length !== 0 && 'text-destructive'}`}>
                <h2 className='font-semibold text-xl tracking-tight'>
                  Upload your image
                  <span
                    className={
                      form.formState.errors.image || fileRejections.length !== 0
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }
                  />
                </h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className='mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-foreground shadow-sm'
                >
                  {preview && (
                    <Image
                      src={preview as string}
                      alt="Uploaded image"
                      className="rounded-lg object-contain"
                      width={400}
                      height={300}
                      layout="intrinsic"
                    />
                  )}
                  <ImagePlus className={`size-40 ${preview ? 'hidden' : 'block'}`} />
                  <Input {...getInputProps()} type="file" />
                  {isDragActive ? (
                    <p>Drop the image!</p>
                  ) : (
                    <p>Click here or drag an image to upload it</p>
                  )}
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
