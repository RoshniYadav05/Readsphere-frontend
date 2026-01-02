"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer } from "react-toastify";
// if you moved Review type to a shared file
type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  rating: string;
};

type FeedbackDialogProps = {
  onAddReview: (review: Review) => void;
};

export default function FeedbackDialog({ onAddReview }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");
  const { user } = useUser();

  const handleSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    };

    const newReview: Review = {
      name: user.fullName || "Anonymous",
      username: "@" + (user.username || user.primaryEmailAddress?.emailAddress.split("@")[0] || "user"),
      img: user.imageUrl,
      body: feedback,
      rating: "⭐⭐⭐⭐⭐", // default rating or you can make this dynamic later
    };

    onAddReview(newReview);
    setFeedback("");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-400 hover:text-slate-900 hover:border-slate-950"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>We value your feedback!</AlertDialogTitle>
          <AlertDialogDescription>
            Please let us know what you think about our service.
          </AlertDialogDescription>
        </AlertDialogHeader>
        < ToastContainer />

        <div className="space-y-4">
          <Textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
