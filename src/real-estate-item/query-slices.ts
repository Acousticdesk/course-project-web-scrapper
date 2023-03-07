import { RealEstateItemAttributes } from "./interface";

export function getApartmentYear() {
  function getYear(d: string | null) {
    return d?.match(/202\d/g)?.[0];
  }

  const dateSelectElement = document.querySelector(
    "#price-history .UISelect-input"
  );

  let years;

  if (dateSelectElement) {
    // @ts-ignore
    dateSelectElement.click();

    const yearsDropdown = document.querySelector(".UIPopup.-opened");

    years = !yearsDropdown
      ? []
      : [...yearsDropdown.querySelectorAll(".UIRadio-content")]
          .map((d) => d.textContent)
          .map(getYear)
          .filter((d) => !!d);
  } else {
    years = [
      getYear(
        (
          document.querySelector(
            'input[name="date-select"]'
          ) as HTMLInputElement
        )?.value
      ),
    ];
  }

  return years.length
    ? years.reduce((acc, y) => acc + Number(y), 0) / years.length
    : null;
}

export function getApartmentAttributes() {
  const attributeElements = [
    ...document.querySelectorAll(".BuildingAttributes-info"),
  ];

  return attributeElements.reduce<RealEstateItemAttributes>(
    (acc, attribute) => {
      // TODO akicha: num_aparments is a String, but should be a number
      const realEstateAttributesMap = {
        // клас: "class",
        // "технологія будівництва": "construction_technology",
        // стіни: "walls",
        // утеплення: "insulation",
        // опалення: "heating",
        "кількість квартир": "numApartmentsTotal",
        "висота стелі": "ceilingHeight",
        // "стан квартири": "state",
        // "закрита територія": "protected_area",
        // паркінг: "parking",
      } as const;

      const currentAttribute = attribute
        .querySelector(".BuildingAttributes-name")
        ?.textContent?.toLowerCase();

      if (currentAttribute && currentAttribute in realEstateAttributesMap) {
        const currentAttributeTyped =
          currentAttribute as (typeof realEstateAttributesMap)[keyof typeof realEstateAttributesMap];

        let value = attribute.querySelector(
          ".BuildingAttributes-value"
        )?.textContent;

        if (currentAttribute === "висота стелі") {
          value = value?.match(/\d+/g)?.[0];
          // @ts-ignore
          value = value ? Number(value) : value;
        }

        if (currentAttribute === "кількість квартир") {
          // @ts-ignore
          value = value ? Number(value) : value;
        }

        // TODO akicha: Sometimes class of the property is null, find out in which case this happens
        acc[
          realEstateAttributesMap[
            currentAttributeTyped as keyof typeof realEstateAttributesMap
          ]
        ] = value;
      }

      return acc;
    },
    {} as RealEstateItemAttributes
  );
}

export function getApartmentFinancialDetails() {
  const financialsElement = document.querySelector("#credit_installments");

  let financials: {
    installmentPlan?: boolean;
    installmentPlanTerm?: number | null;
  } = {};

  if (financialsElement) {
    let installmentElement = null;
    let hasInstallmentPlan = false;

    [...financialsElement.querySelectorAll(".UICardLink-title")].forEach(
      (element) => {
        if (element.textContent?.toLowerCase()?.includes("розтермінування")) {
          installmentElement = element;
          hasInstallmentPlan = true;
        }
      }
    );

    if (installmentElement) {
      const installmentPlanDetailsRaw = (installmentElement as Element)
        .closest(".UICardLink-content")
        ?.querySelector(".UICardLink-description")
        ?.textContent?.trim();

      // на 1 рік, на 2 роки ...
      const installmentPlanDetails = installmentPlanDetailsRaw
        ? /на\s(\d)\sр/g.exec(installmentPlanDetailsRaw)?.[1]
        : null;

      financials.installmentPlan = true;
      financials.installmentPlanTerm = installmentPlanDetails
        ? window.parseInt(installmentPlanDetails, 10)
        : null;
    }
  }

  return financials;
}
