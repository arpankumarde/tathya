import { redirect } from "next/navigation";
import { v7 as uuidv7 } from "uuid";

export default function Page() {
    const id = uuidv7();
    redirect(`/app/${id}`);
}
