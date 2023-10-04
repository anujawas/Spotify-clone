"use client";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import uniqid from "uniqid";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";


import Model from "./Model"
import Input from "./Input";
import Button from "./Button";


import { useUser } from "@/hooks/useUser";
import useUploadModel from "@/hooks/useUploadModel";

const UploadModel = () => {
    const uploadModel = useUploadModel();
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModel.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);
            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error('Missing error');
                return;
            }
            const uniqueID = uniqid();
            //Upload song

            const uploadToastID = toast.loading('Song is Being Uploaded')
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload');
            }

            // Upload Image
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed Image upload');
            }
            const {
                error: supabaseError
            } = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            })

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }
            toast.remove(uploadToastID);
            router.refresh();
            setIsLoading(false);
            reset();
            uploadModel.onClose();
            toast.success('Song Uploaded!');


        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Model title="Upload your song"
            description="Upload an mp3 file"
            isOpen={uploadModel.isOpen}
            onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4">
                <Input
                    id='title'
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id='author'
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song Author"
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id='song'
                        type="file"
                        disabled={isLoading}
                        {...register('song', { required: true })}
                        accept=".mp3"
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an Image
                    </div>
                    <Input
                        id='image'
                        type="file"
                        disabled={isLoading}
                        {...register('image', { required: true })}
                        accept="image/*"
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>

            </form>
        </Model>
    )
}
export default UploadModel;