import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import WarningModal from "../../ui/common/WarningModal";
import { Loader } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { CompleteProfileType } from "@/types/types";
import { useTranslations } from "next-intl";

interface Country {
  country: string;
  cities: string[];
}

interface ChanceUserInfoFormProps {
  form: UseFormReturn<CompleteProfileType>;
}

const ChangeUserInfoForm: FC<ChanceUserInfoFormProps> = ({ form }) => {
  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const t = useTranslations("complete_profile_page");

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("/country.json");
      const data: Country[] = await res.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  const onCountryChange = (country: string) => {
    const selectedCountry = countries.find((item) => item.country === country);
    if (selectedCountry) setCities(selectedCountry.cities);
    else setCities([]);

    form.setValue("city", "");
  };

  return (
    <div className="flex-1 flex flex-col gap-3">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input minLength={5} placeholder={t("username_input_placeholder")} {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onCountryChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("country_input_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country, i) => (
                      <SelectItem
                        key={country.country + i}
                        value={country.country}
                      >
                        {country.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("city_input_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city, i) => (
                      <SelectItem key={city + i} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  maxLength={300}
                  placeholder={t("biography_input_placeholder")}
                  className="min-h-[170px]"
                />
                <span className="text-sm absolute bottom-0 right-4">
                  {field.value?.length || 0}/300
                </span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="ms-auto space-x-2 mt-4 ">
        <WarningModal
          header={t("skip_warning_modal.header")}
          desc={t("skip_warning_modal.desc")}
          trigger={
            <Button variant="outline" size="lg">
              {t("skip_button")}
            </Button>
          }
          action={
            <Link href="/">
              <Button>{t("skip_button")}</Button>
            </Link>
          }
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          variant="default"
          size="lg"
        >
          {form.formState.isSubmitting ? (
            <>
              {t("loading")}
              <Loader size={20} className="animate-spin ms-2" />
            </>
          ) : (
            <>{t("save_button")}</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChangeUserInfoForm;
