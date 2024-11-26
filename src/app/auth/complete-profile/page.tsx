import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompleteProfileClient from "@/components/Auth/CompleteProfile/CompleteProfileClient";
import { getTranslations } from "next-intl/server";

const CompleteProfile = async () => {
  const t = await getTranslations("complete_profile_page");
  return (
    <div className="min-[500px]:container  place-content-center min-h-screen">
      <Card>
        <CardHeader className="pt-6">
          <CardTitle>{t("header")}</CardTitle>
          <CardDescription>
            {t("desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompleteProfileClient />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
