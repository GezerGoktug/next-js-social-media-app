import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import Logo from "../ui/common/Logo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const FormCard = async () => {
  const t = await getTranslations("auth_page");
  return (
    <section className="absolute  size-full grid place-items-center    lg:size-auto z-20 lg:static lg:flex-1   ">
      <Card className="mx-2 xs:mx-4 max-w-md !rounded-lg  shadow-md border-slate-200/50">
        <CardHeader>
          <Logo className="justify-center mb-3" />
          <CardDescription className="text-center">
            {t("desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <RegisterForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default FormCard;
