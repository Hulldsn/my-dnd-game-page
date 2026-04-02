<script setup lang="ts">
import { computed } from 'vue'
import { gameProject } from '../content/gameProject'

const theme = computed(() => gameProject.hero.colorTheme ?? '#7c3aed')
</script>

<template>
  <div class="page" :style="{ '--theme': theme }">
    <header class="hero">
      <div class="hero-bg" v-if="gameProject.hero.coverImageUrl" aria-hidden="true">
        <img :src="gameProject.hero.coverImageUrl" alt="" />
      </div>

      <div class="hero-content">
        <div class="hero-title">
          <div class="kicker">
            {{ gameProject.quickFacts.engine }} · {{ gameProject.quickFacts.status ?? 'in_progress' }}
          </div>
          <h1>{{ gameProject.title }}</h1>
          <p class="subtitle">{{ gameProject.subtitle }}</p>
        </div>

        <nav class="hero-nav" aria-label="页面目录">
          <a href="#overview">概览</a>
          <a href="#turn-flow">一回合流程</a>
          <a href="#action-system">行动系统</a>
          <a href="#combat-rules">战斗规则</a>
          <a href="#units">单位与技能</a>
          <a href="#stages">关卡/场景</a>
          <a href="#media">媒体</a>
          <a href="#roadmap">里程碑</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div class="hero-links" v-if="gameProject.links.length">
          <a
            v-for="l in gameProject.links"
            :key="l.label"
            class="btn"
            :href="l.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ l.label }}
          </a>
        </div>
      </div>
    </header>

    <main class="content">
      <section id="overview" class="block">
        <h2>概览</h2>
        <div class="facts">
          <div class="fact">
            <div class="fact-label">类型</div>
            <div class="fact-value">{{ gameProject.quickFacts.genre }}</div>
          </div>
          <div class="fact">
            <div class="fact-label">平台</div>
            <div class="fact-value">{{ gameProject.quickFacts.platforms?.join(' / ') ?? '-' }}</div>
          </div>
          <div class="fact">
            <div class="fact-label">版本</div>
            <div class="fact-value">{{ gameProject.quickFacts.version ?? '-' }}</div>
          </div>
          <div class="fact">
            <div class="fact-label">发行年份</div>
            <div class="fact-value">{{ gameProject.quickFacts.releaseYear ?? '-' }}</div>
          </div>
        </div>

        <h3>背景与目标</h3>
        <p v-if="gameProject.background.problemOrGoal">{{ gameProject.background.problemOrGoal }}</p>
        <p v-if="gameProject.background.designPhilosophy">{{ gameProject.background.designPhilosophy }}</p>
        <ul v-if="gameProject.background.inspirations?.length" class="list">
          <li v-for="it in gameProject.background.inspirations" :key="it">{{ it }}</li>
        </ul>

        <div v-if="gameProject.devNotes?.length" class="note">
          <div class="note-title">开发说明</div>
          <ul class="list">
            <li v-for="n in gameProject.devNotes" :key="n">{{ n }}</li>
          </ul>
        </div>
      </section>

      <section id="turn-flow" class="block">
        <h2>一回合流程</h2>
        <ol class="steps">
          <li v-for="p in gameProject.turnBasedCore.turnFlow" :key="p.phase">
            <div class="step-title">{{ p.phase }}</div>
            <div class="step-desc" v-if="p.description">{{ p.description }}</div>
          </li>
        </ol>
      </section>

      <section id="action-system" class="block">
        <h2>行动系统与规则要点</h2>
        <div class="subhead">{{ gameProject.turnBasedCore.actionSystem.systemName }}</div>

        <h3>可行动作（示例）</h3>
        <div class="grid-2">
          <div v-for="a in gameProject.turnBasedCore.actionSystem.actions" :key="a.name" class="card">
            <div class="card-title">
              {{ a.name }}
              <span v-if="a.cost" class="pill">消耗：{{ a.cost }}</span>
            </div>
            <div class="card-text" v-if="a.description">{{ a.description }}</div>
          </div>
        </div>

        <h3>回合规则</h3>
        <ul class="list">
          <li v-for="r in gameProject.turnBasedCore.actionSystem.turnRules" :key="r">{{ r }}</li>
        </ul>
      </section>

      <section id="combat-rules" class="block">
        <h2>战斗规则</h2>
        <ul class="list">
          <li v-for="r in gameProject.turnBasedCore.combatRules" :key="r">{{ r }}</li>
        </ul>

        <div v-if="gameProject.turnBasedCore.statusEffects?.length" class="card">
          <div class="card-title">状态效果（示例）</div>
          <div class="grid-2">
            <div
              v-for="s in gameProject.turnBasedCore.statusEffects"
              :key="s.name"
              class="mini-card"
            >
              <div class="mini-title">
                {{ s.name }}
                <span v-if="s.durationRule" class="pill">持续：{{ s.durationRule }}</span>
              </div>
              <div class="mini-text">{{ s.effectSummary }}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="units" class="block">
        <h2>单位与技能</h2>

        <h3>单位属性</h3>
        <div class="table-wrap">
          <table class="table" role="table" aria-label="单位属性表">
            <thead>
              <tr>
                <th>单位</th>
                <th v-for="a in gameProject.turnBasedCore.unitStats.attributes" :key="a.key">
                  {{ a.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in gameProject.units" :key="u.id">
                <td class="unit-name">
                  <div class="unit-name-inner">
                    <img v-if="u.portraitImageUrl" :src="u.portraitImageUrl" :alt="u.name" class="avatar" />
                    <div>
                      <div class="unit-title">{{ u.name }}</div>
                      <div class="unit-role">{{ u.role }}{{ u.faction ? ` · ${u.faction}` : '' }}</div>
                    </div>
                  </div>
                </td>
                <td v-for="a in gameProject.turnBasedCore.unitStats.attributes" :key="a.key">
                  {{ u.attributes[a.key] ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>技能列表</h3>
        <div class="grid-2">
          <div v-for="u in gameProject.units" :key="u.id" class="card">
            <div class="card-title">{{ u.name }}</div>
            <div class="card-text muted" v-if="u.description">{{ u.description }}</div>
            <ul class="list">
              <li v-for="s in u.skills" :key="s.name">
                <span class="strong">{{ s.name }}</span>
                <span v-if="s.cooldown" class="pill">冷却：{{ s.cooldown }}</span>
                <div v-if="s.description" class="muted">{{ s.description }}</div>
                <div v-if="s.tags?.length" class="tags">
                  <span v-for="t in s.tags" :key="t" class="tag">{{ t }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="stages" class="block">
        <h2>关卡/战斗场景</h2>
        <div class="grid-2">
          <div v-for="s in gameProject.stages" :key="s.id" class="card">
            <div class="card-title">
              {{ s.name }}
              <span v-if="s.difficulty" class="pill">难度：{{ s.difficulty }}</span>
              <span v-if="s.recommendedLevel != null" class="pill">推荐：Lv{{ s.recommendedLevel }}</span>
            </div>
            <div class="card-text">{{ s.objective }}</div>
            <img v-if="s.previewImageUrl" :src="s.previewImageUrl" :alt="s.name" class="thumb" />
            <ul v-if="s.mechanicsNotes?.length" class="list">
              <li v-for="n in s.mechanicsNotes" :key="n">{{ n }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="media" class="block">
        <h2>媒体素材</h2>
        <h3>截图</h3>
        <div class="grid-2">
          <figure v-for="(shot, idx) in gameProject.media.screenshots" :key="idx" class="figure">
            <img :src="shot.url" :alt="shot.caption ?? `Screenshot ${idx + 1}`" class="thumb" />
            <figcaption class="caption" v-if="shot.caption">{{ shot.caption }}</figcaption>
          </figure>
        </div>

        <h3>视频</h3>
        <div class="grid-2" v-if="gameProject.media.videos.length">
          <div v-for="v in gameProject.media.videos" :key="v.url || v.title" class="card">
            <div class="card-title">{{ v.title ?? 'Video' }}</div>
            <div class="card-text muted" v-if="v.url">
              <a :href="v.url" target="_blank" rel="noreferrer">打开链接</a>
            </div>
            <div v-else class="card-text muted">暂无视频链接</div>
          </div>
        </div>
      </section>

      <section id="roadmap" class="block">
        <h2>里程碑（Roadmap）</h2>
        <div v-if="gameProject.roadmap?.length" class="grid-2">
          <div v-for="m in gameProject.roadmap" :key="m.milestone" class="card">
            <div class="card-title">
              {{ m.milestone }}
              <span v-if="m.status" class="pill">状态：{{ m.status }}</span>
              <span v-if="m.eta" class="pill">ETA：{{ m.eta }}</span>
            </div>
            <div class="card-text muted" v-if="m.notes">{{ m.notes }}</div>
          </div>
        </div>
        <div v-else class="muted">暂时没有里程碑内容。</div>
      </section>

      <section id="faq" class="block">
        <h2>常见问题（FAQ）</h2>
        <div v-if="gameProject.faq?.length" class="faq">
          <details v-for="f in gameProject.faq" :key="f.q" class="faq-item">
            <summary>{{ f.q }}</summary>
            <div class="faq-answer">{{ f.a }}</div>
          </details>
        </div>
        <div v-else class="muted">暂时没有 FAQ。</div>
      </section>
    </main>
  </div>
</template>

