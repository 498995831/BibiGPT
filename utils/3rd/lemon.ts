export async function activeLicenseKey(licenseKey: string, bvId?: string) {
  // https://docs.lemonsqueezy.com/help/licensing/license-api
  const response = await fetch(
    `https://api.lemonsqueezy.com/v1/licenses/activate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LEMON_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: bvId || "b.jimmylv.cn",
      }),
    }
  );
  const result = await response.json();
  return result.actived;
}