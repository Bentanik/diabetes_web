"use client";

import React, { useState, useEffect } from "react";
import useGetBlog from "../hooks/use-get-blog";
import { da } from "date-fns/locale";
import Image from "next/image";

export default function BlogDetail({ blogId }: REQUEST.BlogId) {
    const { getBlogApi, isPending } = useGetBlog();
    const [data, setData] = useState<API.TGetBlog>();

    useEffect(() => {
        const handleGetData = async (id: string) => {
            try {
                const res = await getBlogApi({ blogId: id });
                setData(res?.data);
            } catch (err) {
                console.log(err);
            }
        };
        handleGetData(blogId);
    }, [blogId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <div>
            {isPending && <div>...Loading</div>}
            <div className="mt-5 py-[2%] px-[10%] bg-[#ffffff] shadow-2xl rounded-2xl">
                {/*Header*/}
                <div>
                    <h1 className="text-[2.7rem] font-bold leading-[49px] text-justify">
                        {data?.title}
                    </h1>
                    <div className="flex mt-4">
                        <Image
                            src={data?.doctor.imageUrl ?? "/images/auth1.jpg"}
                            alt="doctor-avatar"
                            width={30}
                            height={30}
                            className="w-[50px] h-[50px]"
                        />
                        <div className="">
                            <p className="font-medium">
                                {data?.doctor.fullName}
                            </p>
                            <p className="text-gray-400">
                                {data?.createdDate
                                    ? formatDate(data.createdDate)
                                    : "Không hiển thị ngày đăng"}
                            </p>
                        </div>
                    </div>
                    {/* <div className="mt-4">
                        <Image
                            src={data?.thumbnail ?? "/images/auth1.jpg"}
                            alt="doctor-avatar"
                            width={30}
                            height={30}
                            className="w-full h-[500px] rounded-2xl object-cover"
                        />
                    </div> */}
                </div>

                {/* Main Content */}
                <div
                    className="mt-6 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                        __html: data?.contentHtml || "",
                    }}
                />
            </div>
        </div>
    );
}
