# Intake — size the work before anything is created

You have been handed a request in someone's own words. Do these in order and do not skip one —
EXCEPT when the request already names a kind ("use the chore rung", "as a patch"): then do step 1,
skip 2 and 3 entirely (do not read the playbook, do not ask), and go straight to step 4.

1. RESTATE it in at most five lines: what changes for the person using the software, what
   stays the same, and how many distinct behaviours you expect to prove with a test. If the
   request is too vague to do this, say what is missing and stop.

2. SIZE it. Run `lane playbook flow` and read CHOOSING THE RUNG. Pick the ONE rung the work
   fits and say why in one sentence. A rung is how many human signatures the work asks for,
   never how much proof: the tests, the review and the replay are identical on every rung.
     lite         the DEFAULT: scope known, an intent and a design to sign, then tasks proven
                  by tests — no card or plan signatures
     chore        a board item: explore the code, write ONE document (issue + plan + what is
                  skipped), one signature, build, done — no TDD ledger and no review stamp
                  unless that document asks for them
     patch        one story, up to about three behaviours, no new architecture, scope known
     fix          known scope but several tasks or stories, or it needs a technical spec first
     enhancement  a new user-facing capability that needs a product spec first
     master       a new product area; discovery needed

   Kinds are DEFINITIONS, not code: .lane/kinds/<kind>.json names the documents, their order,
   which are signed, and whether cards and plans are signed. `lane kinds` lists them. Copy one,
   rename it, point it at your own templates, and `lane new <yourkind>` works — the proof
   (ledger, snapshot, replay) is the same on every kind; a kind trades signatures only, and
   lane refuses a kind with no signed document before its tasks.

3. ASK before you create anything. If the request already names a kind, take it. Otherwise
   offer exactly four options — the kind you picked (first, marked recommended), two
   neighbours, and "let me rephrase it". What counts as a neighbour depends on whether the
   kind sits on the ceremony LADDER (patch -> fix -> enhancement -> master):
     - on the ladder: the rung one step heavier and the rung one step lighter. At patch there
       is none lighter; at master none heavier — say so rather than inventing one.
     - OFF the ladder (`lite`, the default, and any repo kind — `lane kinds` shows a kind with
       no rung): there is no step up or down to offer. Offer `patch`, the lightest rung, and
       the rung the work would need if it grows — and say plainly that moving there is a
       change of kind, not a step, so `lane promote` does not carry it.
   Use your question tool if you have one, and plain text if you do not. STOP until the human
   answers.

4. CREATE. Run `lane new <kind> <slug>` with a short lowercase slug, then follow exactly what
   lane prints — and keep going: run `lane next` and do what it says, in the same turn, until
   lane names a human signature. Stop THERE, say which folder was created and what is waiting
   to be signed. Creating the folder is not the work; the document lane asks for is.

Never run `lane new` before step 3 is answered. Never pick a rung for the human — you suggest,
they decide at the stamp.
