import { type User } from "@/models";
import { defineStore, acceptHMRUpdate } from "pinia";
import { Loading, Notify, LocalStorage } from "quasar";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/boot/axios";

export const useAuthStore = defineStore("authStore", () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isLogin = computed(() => user.value !== null);
  const role = computed(() => user.value?.role ?? null);

  function saveUserToStorage() {
    LocalStorage.set("user", user.value);
    LocalStorage.set("token", token.value);
  }

  function loadUserFromStorage() {
    const storedUser = LocalStorage.getItem<User>("user");
    const storedToken = LocalStorage.getItem<string>("token");

    if (storedUser && storedToken) {
      user.value = storedUser;
      token.value = storedToken;
    }
  }

  function clearStorage() {
    LocalStorage.remove("user");
    LocalStorage.remove("token");
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      Loading.show();

      // 1. รับ access_token จาก backend
      const res = await api.post<{ access_token: string }>("/auth/login", {
        email,
        password
      });
      token.value = res.data.access_token;

      // 2. ดึงข้อมูล user ด้วย token ที่ได้มา
      const profileRes = await api.get<User>("/users/me", {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      user.value = profileRes.data;

      // 3. บันทึกลง localStorage
      saveUserToStorage();

      return true;
    } catch {
      Notify.create({
        color: "negative",
        icon: "error",
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        position: "top"
      });
      return false;
    } finally {
      Loading.hide();
    }
  }

  async function logout() {
    clearStorage();
    user.value = null;
    token.value = null;
    await router.replace("/auth/login");
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      Loading.show();

      await api.post("/auth/register", { name, email, password });

      // auto-login หลัง register สำเร็จ
      return await login(email, password);
    } catch (err: unknown) {
      const message = isAxiosConflict(err)
        ? "อีเมลนี้ถูกใช้งานแล้ว"
        : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่";

      Notify.create({
        color: "negative",
        icon: "error",
        message,
        position: "top"
      });
      return false;
    } finally {
      Loading.hide();
    }
  }

  function isAxiosConflict(err: unknown): boolean {
    return (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      (err as { response: { status: number } }).response?.status === 409
    );
  }

  loadUserFromStorage();

  return { isLogin, user, token, role, login, logout, register };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
