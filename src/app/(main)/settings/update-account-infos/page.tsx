import isUserHavePassword from "@/actions/user/isUserHavePassword";
import ChangeEmail from "@/components/Settings/ChangeEmail";
import ChangePassword from "@/components/Settings/ChangePassword";
import { getTranslations } from "next-intl/server";

const UpdateAccountInfos = async () => {
  const isHavePassword = await isUserHavePassword();
  const t = await getTranslations("settings_page.account_settings")
  return (
    <>
      <h5 className="font-semibold text-3xl mt-2 ms-2">{t("header")}</h5>
      <ChangePassword isHavePassword={isHavePassword.isPassword} />
      <ChangeEmail />
    </>
  );
};

export default UpdateAccountInfos;
