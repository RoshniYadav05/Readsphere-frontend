"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useMemo } from "react";
import Image from "next/image";


type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  rating: string;
};

const ReviewCard = ({ img, name, username, body }: { img: string; name: string; username: string; body: string }) => (
  <figure
    className={cn(
      "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    )}
  >
    <div className="flex flex-row items-center gap-2">
      <Image
      src={img}
      alt="User Avatar"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full border border-gray-950/[.1] bg-gray-950/[.01] p-1 dark:border-gray-50/[.1] dark:bg-gray-50/[.10]"
      />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
        <p className="text-xs font-medium dark:text-white/40">{username}</p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{body}</blockquote>
  </figure>
);

export default function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  // Use useMemo to split reviews into 3 equal parts dynamically
  const [firstRow, secondRow, thirdRow] = useMemo(() => {
    const chunkSize = Math.ceil(reviews.length / 3);
    return [reviews.slice(0, chunkSize), reviews.slice(chunkSize, chunkSize * 2), reviews.slice(chunkSize * 2)];
  }, [reviews]);

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      {/* First Marquee Row */}
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Second Marquee Row (Reversed Direction) */}
      <Marquee reverse pauseOnHover className="[--duration:22s] mt-4">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Third Marquee Row */}
      <Marquee pauseOnHover className="[--duration:24s] mt-4">
        {thirdRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    </section>
  );
}
