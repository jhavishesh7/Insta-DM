import { UseMutateFunction } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, z } from "zod";
import { toast } from "sonner";

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onFormSubmit = handleSubmit(async (values) => {
    const promptValue = values.prompt || "";
    const replyValue = values.reply || "";
    const words = promptValue.trim().split(/\s+/);
    const reply = replyValue.trim().split(/\s+/);
    const wordLength = promptValue.trim() === "" ? 0 : words.length;
    const replyLength = replyValue.trim() === "" ? 0 : reply.length;

    if (wordLength !== 0 && wordLength <= 250) {
      if (replyLength <= 100) {
        mutation({ ...values });
      } else {
        toast("Please enter a reply with less than 100 words.");
      }
    } else {
      toast("Please enter a prompt between 1 and 250 words.");
    }
  });

  return {
    register,
    errors,
    onFormSubmit,
    watch,
    reset,
    setValue,
  };
};

export default useZodForm;
