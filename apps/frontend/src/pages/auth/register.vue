<template>
  <div class="register-page">
    <!-- Left Panel -->
    <div class="left-panel">
      <div class="left-content">
        <div class="brand-icon">
          <q-icon name="psychology" size="56px" color="white" />
        </div>

        <h1 class="welcome-heading">
          เริ่มต้นการเรียนรู้<br />
          <span class="highlight">ด้วย AI ที่ชาญฉลาด</span>
        </h1>

        <p class="welcome-sub">
          สมัครสมาชิกฟรี แล้วเริ่มอัปโหลดเอกสาร<br />
          ให้ AI ช่วยสร้างข้อสอบและสรุปเนื้อหาให้คุณ
        </p>

        <div class="features">
          <div class="feature-item">
            <q-icon name="how_to_reg" size="20px" color="white" />
            <span>สมัครฟรี ไม่มีค่าใช้จ่าย</span>
          </div>
          <div class="feature-item">
            <q-icon name="bolt" size="20px" color="white" />
            <span>เริ่มใช้งานได้ทันทีหลังสมัคร</span>
          </div>
          <div class="feature-item">
            <q-icon name="security" size="20px" color="white" />
            <span>ข้อมูลของคุณปลอดภัย 100%</span>
          </div>
        </div>

        <div class="deco-circle deco-1" />
        <div class="deco-circle deco-2" />
        <div class="deco-circle deco-3" />
      </div>
    </div>

    <!-- Right Panel: Form -->
    <div class="right-panel">
      <div class="form-box">
        <div class="form-logo">
          <div class="logo-icon">
            <q-icon name="psychology" size="28px" color="white" />
          </div>
          <span class="logo-text">AI Assistant Study</span>
        </div>

        <h2 class="form-heading">สร้างบัญชีใหม่</h2>
        <p class="form-sub">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>

        <div class="form-fields">
          <!-- Name -->
          <q-input
            v-model="name"
            outlined
            label="ชื่อ-นามสกุล"
            placeholder="กรอกชื่อของคุณ"
            type="text"
            class="field"
            bg-color="grey-1"
            :error="!!nameError"
            :error-message="nameError"
          >
            <template #prepend>
              <q-icon name="person_outline" color="blue-grey-5" />
            </template>
          </q-input>

          <!-- Email -->
          <q-input
            v-model="email"
            outlined
            label="อีเมล"
            placeholder="กรอกอีเมลของคุณ"
            type="email"
            class="field"
            bg-color="grey-1"
            :error="!!emailError"
            :error-message="emailError"
          >
            <template #prepend>
              <q-icon name="mail_outline" color="blue-grey-5" />
            </template>
          </q-input>

          <!-- Password -->
          <q-input
            v-model="password"
            outlined
            label="รหัสผ่าน"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            :type="showPassword ? 'text' : 'password'"
            class="field"
            bg-color="grey-1"
            :error="!!passwordError"
            :error-message="passwordError"
          >
            <template #prepend>
              <q-icon name="lock_outline" color="blue-grey-5" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                color="blue-grey-5"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Confirm Password -->
          <q-input
            v-model="confirmPassword"
            outlined
            label="ยืนยันรหัสผ่าน"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            :type="showConfirm ? 'text' : 'password'"
            class="field"
            bg-color="grey-1"
            :error="!!confirmError"
            :error-message="confirmError"
            @keyup.enter="onSubmit"
          >
            <template #prepend>
              <q-icon name="lock_outline" color="blue-grey-5" />
            </template>
            <template #append>
              <q-icon
                :name="showConfirm ? 'visibility' : 'visibility_off'"
                color="blue-grey-5"
                class="cursor-pointer"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </q-input>

          <!-- Submit -->
          <q-btn
            label="สมัครสมาชิก"
            class="submit-btn"
            no-caps
            unelevated
            size="md"
            :loading="isLoading"
            :disable="isLoading"
            @click="onSubmit"
          />
        </div>

        <div class="divider-row">
          <div class="divider-line" />
          <span class="divider-text">หรือ</span>
          <div class="divider-line" />
        </div>

        <p class="login-text">
          มีบัญชีอยู่แล้ว?
          <router-link to="/auth/login" class="login-link"
            >เข้าสู่ระบบ</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);
const isLoading = ref(false);
const submitted = ref(false);

const nameError = computed(() => {
  if (!submitted.value) return "";
  if (!name.value.trim()) return "กรุณากรอกชื่อ";
  return "";
});

const emailError = computed(() => {
  if (!submitted.value) return "";
  if (!email.value) return "กรุณากรอกอีเมล";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    return "รูปแบบอีเมลไม่ถูกต้อง";
  return "";
});

const passwordError = computed(() => {
  if (!submitted.value) return "";
  if (!password.value) return "กรุณากรอกรหัสผ่าน";
  if (password.value.length < 6)
    return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
  return "";
});

const confirmError = computed(() => {
  if (!submitted.value) return "";
  if (!confirmPassword.value) return "กรุณายืนยันรหัสผ่าน";
  if (confirmPassword.value !== password.value) return "รหัสผ่านไม่ตรงกัน";
  return "";
});

const isValid = computed(
  () =>
    !nameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmError.value
);

async function onSubmit() {
  submitted.value = true;
  if (!isValid.value) return;

  isLoading.value = true;
  const success = await authStore.register(
    name.value.trim(),
    email.value,
    password.value
  );
  isLoading.value = false;

  if (success) {
    await router.push("/auth/login");
  }
}
</script>

<style scoped lang="scss">
.register-page {
  display: flex;
  min-height: 100vh;
}

.left-panel {
  flex: 0 0 60%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #4c1d95 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
}

.left-content {
  position: relative;
  z-index: 2;
  padding: 48px;
  max-width: 520px;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 32px;
}

.welcome-heading {
  font-size: 2.4rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0 0 16px;
}

.highlight {
  background: linear-gradient(90deg, #818cf8, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-sub {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 36px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
  backdrop-filter: blur(4px);
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  pointer-events: none;
}

.deco-1 {
  width: 340px;
  height: 340px;
  background: #818cf8;
  top: -80px;
  right: -80px;
}

.deco-2 {
  width: 220px;
  height: 220px;
  background: #c4b5fd;
  bottom: 40px;
  left: -60px;
}

.deco-3 {
  width: 140px;
  height: 140px;
  background: #fff;
  bottom: 160px;
  right: 40px;
}

.right-panel {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 48px 24px;
  }
}

.form-box {
  width: 100%;
  max-width: 400px;
}

.form-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #1e3a8a, #4c1d95);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.3px;
}

.form-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
}

.form-sub {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 28px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  border-radius: 10px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e3a8a, #4c1d95);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition:
    opacity 0.2s,
    transform 0.15s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.divider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  color: #94a3b8;
  font-size: 0.8rem;
  white-space: nowrap;
}

.login-text {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.login-link {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
