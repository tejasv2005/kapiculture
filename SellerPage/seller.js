// seller.js

document.addEventListener("DOMContentLoaded", () => {
  const stepOneForm = document.getElementById("stepOneForm");
  const stepTwoForm = document.getElementById("stepTwoForm");

  const stepOneSection = document.getElementById("step-one");
  const stepTwoSection = document.getElementById("step-two");
  const successPage = document.getElementById("success-page");

  const nextStepBtn = document.getElementById("nextStepBtn");
  const submitBtn = document.getElementById("submitSellerForm");

  const gstInput = document.getElementById("gst");
  const gstError = document.getElementById("gstError");

  const sameNameToggle = document.getElementById("sameNameToggle");
  const brandNameInput = document.getElementById("brandName");
  const storeNameInput = document.getElementById("storeName");

  const progressSteps = document.querySelectorAll(".progress-bar .step");

  // ===== VALIDATION: GST =====
  gstInput.addEventListener("input", () => {
    if (gstInput.value.length !== 15) {
      gstError.style.display = "block";
    } else {
      gstError.style.display = "none";
    }
  });

  // ===== AUTO-FILL STORE NAME =====
  sameNameToggle.addEventListener("change", () => {
    if (sameNameToggle.checked) {
      storeNameInput.value = brandNameInput.value;
      storeNameInput.disabled = true;
    } else {
      storeNameInput.disabled = false;
    }
  });

  brandNameInput.addEventListener("input", () => {
    if (sameNameToggle.checked) {
      storeNameInput.value = brandNameInput.value;
    }
  });

  // ===== NEXT STEP (Step 1 -> Step 2) =====
  nextStepBtn.addEventListener("click", () => {
    if (gstInput.value.length !== 15) {
      gstError.style.display = "block";
      return;
    }

    stepOneSection.classList.add("hidden");
    stepTwoSection.classList.remove("hidden");
    progressSteps[0].classList.remove("active");
    progressSteps[1].classList.add("active");
  });

  // ===== IMAGE PREVIEW (Brand Logo) =====
  const brandLogoInput = document.getElementById("brandLogo");
  brandLogoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgPreview = document.createElement("img");
        imgPreview.src = reader.result;
        imgPreview.style.maxWidth = "100px";
        imgPreview.style.marginTop = "0.5rem";
        brandLogoInput.insertAdjacentElement("afterend", imgPreview);
      };
      reader.readAsDataURL(file);
    }
  });

  // ===== FINAL SUBMIT =====
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const requiredFields = stepTwoForm.querySelectorAll("input[required], textarea[required]");
    let formValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = "red";
        formValid = false;
      } else {
        field.style.borderColor = "#ccc";
      }
    });

    if (!formValid) {
      alert("Please fill all required fields correctly.");
      return;
    }

    // Simulate successful submission
    stepTwoSection.classList.add("hidden");
    successPage.classList.remove("hidden");
    progressSteps[1].classList.remove("active");
    progressSteps[2].classList.add("active");
  });
});
