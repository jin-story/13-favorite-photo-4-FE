// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 혹시 팀에서 추가로 강제하고 싶은 커밋 규칙이 있다면 여기에 적습니다.
    // 기본(conventional) 규칙만으로도 feat:, fix:, docs:, chore: 등이 강제됩니다.
    "subject-case": [0, "never"],
  },
};
