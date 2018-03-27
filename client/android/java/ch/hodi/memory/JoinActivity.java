package ch.hodi.memory;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.content.Intent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class JoinActivity extends AppCompatActivity {
    public String strName = null;
    public String strGame = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_join);

        final EditText game = findViewById(R.id.gameField);
        final EditText name = findViewById(R.id.nameField);
        Button button = findViewById(R.id.joinButton);

        final SharedPreferences prefs = this.getPreferences(Context.MODE_PRIVATE);

        strName = prefs.getString("ch.hodi.memory.name", "Anonymous");
        strGame = prefs.getString("ch.hodi.memory.game", "Dummy");

        name.setText(strName);
        game.setText(strGame);

        button.setOnClickListener(new View.OnClickListener() {
                                      @Override
                                      public void onClick(View v) {
                                          Intent i = new Intent(getApplicationContext(), MainActivity.class);

                                          strName = name.getText().toString();
                                          strGame = game.getText().toString();

                                          prefs.edit().putString("ch.hodi.memory.name", strName).apply();
                                          prefs.edit().putString("ch.hodi.memory.game", strGame).apply();

                                          i.putExtra("NAME", strName);
                                          i.putExtra("GAME", strGame);

                                          startActivity(i);
                                      }
                                  }
        );
    }
}
